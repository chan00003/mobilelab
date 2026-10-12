import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

function optionalValue(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function summarizeFailure(test, result) {
  return {
    title: test.titlePath().join(' > '),
    status: result.status,
    errors: result.errors.map(({ message }) => message || 'Unknown test error'),
  };
}

export default class QaSummaryReporter {
  constructor(options = {}) {
    this.outputFile = options.outputFile || 'playwright-report/remote/qa-summary.json';
    this.startedAt = new Date().toISOString();
    this.tests = [];
    this.baseURL = null;
  }

  onBegin(config) {
    this.baseURL = config.projects[0]?.use?.baseURL || null;
  }

  onTestEnd(test, result) {
    this.tests.push({
      title: test.titlePath().join(' > '),
      status: result.status,
      durationMs: result.duration,
      ...(result.status === 'failed' ? { failure: summarizeFailure(test, result) } : {}),
    });
  }

  onEnd(result) {
    const failures = this.tests
      .filter(({ status }) => !['passed', 'skipped'].includes(status))
      .map(({ failure, title, status }) => failure || { title, status, errors: [] });
    const summary = {
      schemaVersion: 1,
      testedUrl: this.baseURL,
      expectedDeploymentId: optionalValue(process.env.REMOTE_EXPECTED_DEPLOYMENT_ID),
      expectedCommitSha: optionalValue(process.env.REMOTE_EXPECTED_COMMIT_SHA),
      deploymentIdentity: {
        deploymentId: 'not independently verified; value above is user-supplied metadata',
        commitSha: 'not independently verified; value above is user-supplied metadata',
      },
      execution: {
        startedAt: this.startedAt,
        finishedAt: new Date().toISOString(),
        status: result.status,
        passed: this.tests.filter(({ status }) => status === 'passed').length,
        failed: failures.length,
        skipped: this.tests.filter(({ status }) => status === 'skipped').length,
        total: this.tests.length,
      },
      failures,
    };

    const outputPath = path.resolve(this.outputFile);
    mkdirSync(path.dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  }
}
