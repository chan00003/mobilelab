// Long-form editorial content for the published Mobile Lab field notes.
// The renderer owns heading IDs and the table of contents so links stay stable.
export const expandedArticles = {
  'why-most-business-automation-fails': {
    sections: [
      { heading: 'Automation starts with the work, not the tool', paragraphs: [
        'A request to automate usually arrives as a software request: connect a CRM, add a chatbot, or make a report update itself. Those requests are understandable, but they describe a preferred solution before the business has described the work. The useful starting point is a short, observable journey from trigger to outcome. What starts the job, who touches it, what information is needed, and what proves that the job is complete?',
        'This distinction matters because a system can execute a badly designed process perfectly. If a team has no clear owner for an inquiry, adding an automated notification creates more noise rather than faster service. If a quote requires information nobody records consistently, an AI assistant can only guess or ask the same question again. Diagnose the handoffs before choosing the mechanism that will carry them.'
      ], subsections: [
        { heading: 'Ask four questions before buying anything', paragraphs: [
          'Write down the trigger, the decision, the handoff, and the definition of done. Keep the language concrete: “a customer submits a booking request” is more useful than “we need better lead management.” The map should show the real tools and people involved, including spreadsheets, inboxes, chat groups, and the manual checks that are easy to omit.',
          'Then observe a few recent examples. Compare what the process is supposed to do with what actually happened. The difference usually reveals the first worthwhile automation boundary: a missing field, a repeated copy-and-paste job, an approval that has no owner, or a status that lives only in one person’s memory.'
        ] }
      ]},
      { heading: 'Why surface symptoms create shelfware', paragraphs: [
        'Surface symptoms are visible and emotionally expensive. A founder sees slow follow-up, so the team buys a lead tool. An operations manager sees late reports, so the team buys a dashboard. A service lead sees inconsistent replies, so the team adds generated messages. Each purchase can be reasonable in isolation, yet the underlying record, ownership, and exception path may remain undefined.',
        'Shelfware is often a process problem expressed through software. A new workspace becomes another place to check because the old source of truth was never retired. A chatbot collects questions but does not create an owned task. A dashboard displays totals but cannot lead an operator to the record that needs attention. Adoption drops because the system does not reduce the work it was introduced to support.'
      ], subsections: [
        { heading: 'Separate friction from preference', paragraphs: [
          'Not every inconvenience deserves automation. A team may prefer a different interface while the actual bottleneck is an approval queue or missing data. Rank friction by consequence: repeated entry, avoidable waiting, preventable errors, unclear ownership, and work that must be reconciled later. This creates a more defensible order of operations than starting with the loudest request.',
          'A good candidate is narrow enough to measure and important enough to matter. It might be routing a qualified inquiry to the right owner, creating a consistent dispatch record, or preparing an invoice draft from a completed job. The first version should make one operational promise and keep that promise visible.'
        ] }
      ]},
      { heading: 'A practical method: diagnose, design, prove, reuse', paragraphs: [
        'Diagnose means locating the bottleneck and naming the source records involved. Design means selecting the smallest maintainable workflow, with clear inputs, outputs, ownership, and failure handling. Prove means checking the workflow against agreed examples rather than celebrating a demo. Reuse means documenting what worked so the next team member can operate and improve it without rediscovering the logic.',
        'The sequence prevents premature complexity. A workflow that cannot be explained on a page is probably not ready to automate. A workflow that depends on an undocumented personal habit is not ready to scale. A workflow that has no acceptance checks is not ready to call finished. These are design constraints, not paperwork; they protect the business from systems nobody can confidently change.'
      ], subsections: [
        { heading: 'Keep the first version deliberately boring', paragraphs: [
          'Use the systems the team already trusts where they are good enough. Add a clear record, a reliable trigger, and an explicit owner before introducing a new layer of intelligence. A small workflow with visible status is easier to test than a broad assistant that appears capable but hides how decisions were made.',
          'When a judgment call is important, keep a human approval gate. Automation can prepare a draft, gather context, or flag an exception while the accountable person decides. That arrangement delivers speed without pretending that every business rule can be inferred safely from incomplete data.'
        ] }
      ]},
      { heading: 'How to prove the system works', paragraphs: [
        'Define acceptance criteria before implementation. A criterion should describe an observable result: a valid inquiry creates one owned task; an incomplete request is held for clarification; a completed job updates the operational record; an exception is visible to the person who can resolve it. Include ordinary, incomplete, duplicate, and failure cases. Happy-path testing alone is how fragile workflows reach production.',
        'Review the proof with the people who operate the process. They know which edge cases are common, which fields are ambiguous, and which alerts will be ignored. Capture the examples used for approval so future changes can be checked against the same standard. This turns “it seems to work” into a repeatable quality loop.'
      ], subsections: [
        { heading: 'Measure behavior you can act on', paragraphs: [
          'Prefer operational signals over vanity metrics. Track unassigned work, records waiting for approval, missing required information, and exceptions that remain unresolved. Those signals point to a decision or intervention. A total number can be useful, but only when an operator can move from the number to the record and take the next step.',
          'Review the workflow after launch. New exceptions may reveal a missing rule, an unclear handoff, or a change in the business. Treat that feedback as maintenance input, not as proof that automation failed. Reliable systems improve because their owners can see where they need attention.'
        ] }
      ]},
      { heading: 'Key takeaways for business owners', paragraphs: [
        'Start with a real process and a named bottleneck. Choose the smallest workflow that can remove a measurable source of delay, error, or rework. Keep ownership and approval visible, prove ordinary and exceptional cases, and document the operating model before expanding the scope. The goal is not to automate everything; it is to make important work easier to execute correctly.',
        'If the team cannot describe the trigger, the source of truth, the owner, and the definition of done, more software will not supply that clarity. Establish it first. Then automation becomes an implementation decision rather than a bet that a new tool will reorganize the business for you.'
      ], subsections: [
        { heading: 'Frequently asked questions', paragraphs: [], faq: [
          ['Should a small business start with AI?', 'Start with a clearly defined workflow. AI may help with drafting, classification, or context gathering, but it should be introduced only after the inputs, approval points, and source records are understood.'],
          ['How much of a process should be automated first?', 'Choose one complete slice with a clear beginning and end. A narrow workflow that reaches a real operator and can be verified is more valuable than a wide partial automation that creates another queue.'],
          ['When should a workflow be rebuilt?', 'Revisit it when exceptions are repeated, ownership is unclear, or the cost of maintaining workarounds exceeds the value of the current design. Use observed failure cases to guide the next version.']
        ] }
      ]}
    ]
  },
  'hidden-cost-spreadsheet-operations': {
    sections: [
      { heading: 'Spreadsheets are useful until the process outgrows them', paragraphs: [
        'A spreadsheet is often the fastest way to make a new process visible. It can hold a list, calculate a total, and give a small team a shared starting point. The trouble begins when the sheet becomes the system of record for work that changes frequently, has several owners, or must be reconciled with other records. At that point the business is paying for flexibility with repeated manual coordination.',
        'The visible cost is not the spreadsheet itself. It is the work around it: asking which tab is current, copying a value into another system, checking whether a status changed, and rebuilding a report because the source rows were edited. Those activities feel too ordinary to count, but they consume attention and make the process difficult to audit.'
      ], subsections: [
        { heading: 'Map every place the same fact is retyped', paragraphs: [
          'Pick one recurring job such as an order, booking, dispatch, or invoice. Follow its important facts from intake to completion. Note where the customer name, amount, status, date, or owner is typed again. Do not limit the map to formal systems; include group chats, email threads, paper notes, and personal trackers.',
          'The map usually shows that the team is not maintaining one spreadsheet. It is maintaining a chain of partial records. Each copy introduces a chance for spelling differences, stale status, or an omitted update. The right response may be a structured workflow, a better form, or a single source of truth—not necessarily a wholesale platform replacement.'
        ] }
      ]},
      { heading: 'The three operational costs that stay hidden', paragraphs: [
        'Repeated typing creates information drift. A small difference in an item name or status can prevent a lookup, produce a duplicate, or send work to the wrong person. The error may be discovered much later, when the original context is gone and someone must reconstruct what happened from messages and versions.',
        'Status friction consumes coordination time. People ask for updates because the record does not make ownership and next action clear. Data disconnect delays reporting. Someone exports, cleans, compares, and reconciles records before the business can answer a straightforward question. None of those tasks appear as a line item called spreadsheet operations, but they are real operating costs.'
      ], subsections: [
        { heading: 'Look for waiting, not just mistakes', paragraphs: [
          'Errors are easy to notice; waiting is easier to normalize. Measure how often a task pauses for a status answer, missing field, manual lookup, or reconciliation. A process that is technically accurate but repeatedly waits for one person to update a sheet still has a design problem.',
          'Interview the people who perform the handoffs. Ask what they check before acting, what they copy, and what they keep outside the official record. These answers reveal where a structured field, automatic handoff, or exception queue can remove work without changing the business rule.'
        ] }
      ]},
      { heading: 'Build a controlled path away from spreadsheet chaos', paragraphs: [
        'Do not begin by trying to replace every sheet. Select one workflow with repeated entry and clear ownership. Define its required fields, valid states, and completion event. Then create a record that can be viewed by the people responsible for the next step. Keep the existing spreadsheet as a reference during transition, but stop treating new copies as the source of truth.',
        'Add validation at the point where information enters the process. Required fields, consistent status values, and a clear owner reduce downstream cleanup. Automate notifications only after the record and state change are reliable. A message should point to work someone can act on, not become another place where status is stored.'
      ], subsections: [
        { heading: 'Preserve a useful audit trail', paragraphs: [
          'A controlled workflow should make changes understandable. Record who owns the next step, when the status changed, and why an exception was raised. The goal is not surveillance; it is the ability to answer a customer or teammate without searching through unrelated conversations.',
          'Plan the migration around behavior. Provide a short operating guide, name the owner, and review the first real examples together. If people continue maintaining parallel personal trackers, ask what the new workflow failed to show them. Parallel records are evidence that the system still has a missing view or rule.'
        ] }
      ]},
      { heading: 'Examples of high-value first workflows', paragraphs: [
        'Order intake is a common candidate because the same facts often move between a form, a sales sheet, a dispatch list, and an invoice. A structured intake can validate required details, create one owned record, and expose the current status to everyone who needs it. The operational win is not a prettier table; it is fewer handoffs that depend on memory.',
        'Dispatch and invoice preparation are other useful candidates. A completed job can update the service record and prepare an invoice draft, while an exception can stay visible for review. The workflow should preserve human judgment for changes, refunds, or unusual jobs rather than turning a spreadsheet formula into an unexamined financial decision.'
      ], subsections: [
        { heading: 'Do not automate reconciliation blindly', paragraphs: [
          'If two sources disagree, the system needs a rule for which record is authoritative and a path for resolving the difference. Automatically choosing the newest value can hide a correction or overwrite a deliberate adjustment. Make disagreement visible until the business has a trusted policy.',
          'Keep reports connected to the underlying records. A useful view should let an owner move from a number to the rows, customer, job, or exception behind it. That traceability is what turns reporting into an operating tool.'
        ] }
      ]},
      { heading: 'Key takeaways and questions to ask', paragraphs: [
        'The spreadsheet is rarely the villain. Unclear ownership, repeated entry, and disconnected records are the underlying problems. Start with one recurring process, identify the facts that drift, establish a source of truth, and make the next action visible. Migrate behavior in a controlled way and keep a human path for exceptions.',
        'A good replacement reduces coordination. People should spend less time asking which record is current and more time completing the work represented by that record.'
      ], subsections: [
        { heading: 'Frequently asked questions', paragraphs: [], faq: [
          ['Do we need to eliminate spreadsheets?', 'No. Keep them where they are appropriate for analysis or temporary work. Move recurring operational records when multiple people depend on current status, ownership, and history.'],
          ['What should be migrated first?', 'Choose a process with frequent repeated entry, visible waiting, and a clear completion event. It gives the team a practical way to compare the old and new operating cost.'],
          ['How do we know the new system is working?', 'Look for fewer duplicate updates, faster access to current status, fewer unresolved exceptions, and a clear path from a report or alert to the record that needs action.']
        ] }
      ]}
    ]
  },
  'stopping-pipeline-leakage': {
    sections: [
      { heading: 'Pipeline leakage is an operating problem', paragraphs: [
        'A new inquiry can arrive through a website form, social message, email, phone call, or a referral. The customer experiences one conversation, but the business may experience several disconnected queues. If no one owns the next step, the inquiry waits. If the context is copied manually, important intent disappears. If qualification lives in a private conversation, the team cannot see why a prospect was or was not followed up.',
        'Pipeline leakage is therefore not solved by adding more campaigns. It is solved by making the path from interest to owned action visible. Capture the inquiry, preserve the context, apply consistent qualification, and create a follow-up that a named person can complete. The system should make the next action easier than leaving the inquiry in an inbox.'
      ], subsections: [
        { heading: 'Define the handoff before the channel', paragraphs: [
          'Start with the point at which a message becomes work. Decide what information is required, which cases need immediate attention, and who owns the first response. This rule should be shared across channels even if the intake interfaces differ. Otherwise each channel develops its own definition of a lead.',
          'Keep the original message or form context attached to the record. A summary can help an operator move quickly, but it should not replace the source details. The person taking over should be able to understand the request without asking the customer to repeat it.'
        ] }
      ]},
      { heading: 'Capture intent without creating a noisy queue', paragraphs: [
        'Centralization is not the same as dumping every message into one list. A useful intake normalizes the minimum fields needed for action: contact identity, request, source, timing, owner, and current state. It can also mark incomplete information so the team knows whether to qualify, clarify, or respond immediately.',
        'Qualification should support a decision, not create a decorative score. Define the few signals that matter to the business: fit, urgency, service area, budget context when appropriate, or a specific operational need. Let the operator see the reason for the qualification and override it when the source context warrants judgment.'
      ], subsections: [
        { heading: 'Use automation to prepare, not to impersonate judgment', paragraphs: [
          'Automation can extract a request, classify a topic, suggest a reply, or route a record. It should not silently promise a capability, invent an answer, or close a prospect because a phrase matched a rule. Keep a review gate for commitments, unusual requests, and cases where the source data is incomplete.',
          'Design the exception path at the same time as the happy path. If a message cannot be classified, it should be visible to a person with enough context to decide. An unknown state is safer than a confident but unsupported response.'
        ] }
      ]},
      { heading: 'Create follow-up that can actually be operated', paragraphs: [
        'A follow-up task should include the customer, the request, the next action, the owner, and a useful due point. “Follow up with lead” is not enough; “confirm delivery requirements and update the opportunity” tells the operator what completion means. Link the task to the source record so the context is one click away.',
        'Avoid creating tasks for every event. A notification that does not change a decision becomes background noise. Use state changes that require an action, and close or reschedule tasks explicitly. A queue that never clears is a sign that the process needs better ownership or fewer automatic triggers.'
      ], subsections: [
        { heading: 'Make response quality inspectable', paragraphs: [
          'Keep a small set of examples for review: a complete inquiry, an incomplete one, a duplicate, an urgent request, and an out-of-scope request. Check whether the record was created once, routed correctly, and given the right next step. This is more useful than judging a workflow from a single successful demo.',
          'Review leakage by asking where inquiries are waiting and why. The answer may be a missing integration, but it may also be an unclear service boundary, a lack of capacity, or an approval that nobody owns. Automation should surface that distinction rather than disguise it.'
        ] }
      ]},
      { heading: 'A practical rollout sequence', paragraphs: [
        'Choose one channel and one service line first. Map the intake fields, define the owner, and connect the record to a clear follow-up state. Run the workflow with real examples while the old process remains available for comparison. Fix missing context and unclear states before adding another channel.',
        'When the first path is stable, reuse its data model and operating rules. Add channel-specific capture only where the source requires it. The shared record, qualification logic, ownership model, and exception handling should remain consistent so the pipeline does not fragment again.'
      ], subsections: [
        { heading: 'Frequently asked questions', paragraphs: [], faq: [
          ['Should every inquiry become a sales opportunity?', 'Every inquiry should be captured and given an appropriate state. Not every inquiry is a qualified opportunity; keeping those distinctions visible prevents the pipeline from becoming inflated and unhelpful.'],
          ['Can AI answer inbound questions automatically?', 'It can assist with straightforward, bounded questions when the source information is trustworthy. Keep human review for commitments, unusual cases, sensitive information, and anything the system cannot verify.'],
          ['What is the first leakage signal to inspect?', 'Look for inquiries with no owner or next action. They are the clearest evidence that interest entered the business but did not become accountable work.']
        ] }
      ]}
    ]
  },
  'ai-automation-audit': {
    sections: [
      { heading: 'An audit is a decision tool, not a software shopping list', paragraphs: [
        'An AI and automation audit creates a grounded view of how work moves through a business. It is not a catalog of fashionable tools or a promise that every manual task should disappear. The useful output is a short, evidence-based set of bottlenecks, constraints, and build-or-buy decisions that an owner can act on.',
        'The audit begins with observation. Speak with the people doing the work, inspect the records they rely on, and compare the documented process with recent examples. The difference between those views is often more valuable than a new technology recommendation because it shows where the business is actually losing time, accuracy, or control.'
      ], subsections: [
        { heading: 'Trace work across people and systems', paragraphs: [
          'Choose a meaningful workflow and follow it from trigger to outcome. Record the source of each important fact, every handoff, every approval, and the point at which work can be paused or reworked. Include informal tools. A process diagram that omits the group chat where decisions happen is not a useful process diagram.',
          'Ask operators to show examples rather than describe the ideal. Examples expose missing fields, duplicate entry, unofficial status labels, and exceptions that the formal procedure does not mention. They also make the eventual recommendations easier to verify with the people who must live with them.'
        ] }
      ]},
      { heading: 'Find the friction that deserves attention', paragraphs: [
        'Not every manual action is a problem. Some checks protect quality, and some decisions are intentionally human. Prioritize friction that repeats, delays a customer or teammate, creates avoidable rework, or makes an important record difficult to trust. A simple task done once is usually less urgent than a small task repeated across every job.',
        'Look for structural signals: a handoff with no owner, a field that is retyped, an approval that lives in a private inbox, a report assembled from several exports, or an exception that has no visible state. These are design opportunities because a better record or workflow can reduce the friction without replacing the judgment that matters.'
      ], subsections: [
        { heading: 'Distinguish data problems from decision problems', paragraphs: [
          'If the team cannot find the source record, better automation will not make the decision reliable. Fix the record and ownership first. If the record is clear but the rule is inconsistent, document the decision criteria before considering automation. Confusing these problems leads to systems that make inconsistent judgment faster.',
          'Also identify constraints that are not technical: privacy obligations, approval authority, contractual rules, staffing, and the consequences of a wrong result. Those constraints belong in the audit because they shape the safe architecture.'
        ] }
      ]},
      { heading: 'Recommend the smallest architecture that fits', paragraphs: [
        'A useful recommendation explains what should happen, where the data should live, who owns it, and how exceptions are handled. It can use an existing tool, a focused integration, an internal interface, or a combination. The choice should follow the process and its constraints rather than an attachment to a particular vendor or model.',
        'Prefer a narrow slice that can be proven. If the audit finds several issues, sequence them by dependency and operational value. A reliable intake record may need to come before an automated report; a clear status model may need to come before an AI assistant. Sequencing protects the business from building a polished layer on unstable inputs.'
      ], subsections: [
        { heading: 'Write an implementation-ready finding', paragraphs: [
          'Each finding should state the current behavior, the consequence, the proposed change, the owner, and the acceptance check. “Use AI for support” is not implementation-ready. “Extract the requested service from the intake, show the source text to the coordinator, and route an incomplete request for clarification” is specific enough to design and test.',
          'Include what should not be built yet. A clear boundary is a sign of a useful audit. It keeps the team from treating every possible enhancement as part of the first release and gives future work a better starting point.'
        ] }
      ]},
      { heading: 'Turn findings into a safe build plan', paragraphs: [
        'The audit should end with decisions the business can schedule: the first workflow, the data and access it needs, the acceptance examples, the operating owner, and the maintenance habit. It should also identify dependencies and risks that need a human decision before implementation begins.',
        'After launch, compare the system to the original observation. Did the handoff become visible? Did the repeated entry disappear? Can an operator explain the current state and next action? If not, return to the workflow rather than adding more automation around the gap.'
      ], subsections: [
        { heading: 'Frequently asked questions', paragraphs: [], faq: [
          ['How long should an audit take?', 'Long enough to observe a real workflow and validate the findings with its operators. The right duration depends on process complexity, not on producing a large document.'],
          ['Does an audit require access to every system?', 'It requires enough evidence to trace the selected workflow. Start with the systems and informal records that carry its decisions; expand only when the evidence shows a dependency.'],
          ['What makes an audit actionable?', 'A short set of prioritized findings with owners, boundaries, acceptance checks, and a clear next step. Recommendations without those details are ideas, not a build plan.']
        ] }
      ]}
    ]
  },
  'quality-assurance-loops': {
    sections: [
      { heading: 'Reliable automation keeps judgment visible', paragraphs: [
        'Automation is valuable when it removes repetitive coordination without hiding the decisions that protect customers, cash, or reputation. Generative systems can draft, classify, summarize, and gather context, but their output still needs an operating boundary. The question is not whether a model can produce a plausible answer; it is whether the business can verify the answer before it matters.',
        'A quality loop makes that boundary explicit. Data is checked against a source of truth, output is routed through the right approval gate, and exceptions remain visible until someone resolves them. This structure lets the team use speed where it is safe and preserve judgment where an error would be expensive.'
      ], subsections: [
        { heading: 'Start with the failure modes', paragraphs: [
          'List what can go wrong in the workflow: wrong customer, missing field, stale price, unsupported claim, duplicate record, unapproved message, or a task sent to the wrong owner. Rank each case by consequence and likelihood in the real process. The list becomes the basis for validation and review rather than a generic promise of “human in the loop.”',
          'Make the source of truth clear for each field. A generated summary can be useful, but it should not silently become the authoritative value. Operators need to see what the system used and what it inferred so they can correct it when context is missing.'
        ] }
      ]},
      { heading: 'Build verification into every handoff', paragraphs: [
        'Structural checks catch problems before a person has to interpret the output. Confirm required fields, valid states, matching identifiers, permitted values, and links to the source record. These checks are simple, but they prevent an incomplete or malformed result from appearing finished.',
        'Semantic review handles what structure cannot. A draft may have every required field and still make a promise the business cannot support. Route customer-facing language, financial changes, compliance decisions, and unusual exceptions to an accountable reviewer. The reviewer should have a clear approve, edit, reject, or escalate action.'
      ], subsections: [
        { heading: 'Keep approval proportional to risk', paragraphs: [
          'Not every low-risk internal classification needs the same gate as a customer commitment. Define which actions can proceed automatically, which require review, and which must never be generated without a specialist. This keeps the loop practical while respecting the consequences of an error.',
          'Approval should not mean clicking a button without context. Show the source details, the proposed change, and the reason for any exception. If a reviewer repeatedly fixes the same issue, treat that pattern as a design signal: the rule, source data, or prompt may need improvement.'
        ] }
      ]},
      { heading: 'Design exception handling as a first-class path', paragraphs: [
        'A reliable workflow does not force every case into a normal state. It gives incomplete, conflicting, or unfamiliar records a visible holding state and an owner. The exception should explain what is missing and what action will clear it. Otherwise the team gets a queue of mysterious failures that cannot be prioritized.',
        'Record the outcome of exceptions. Some will be data quality issues, some will require a new business rule, and some will confirm that a human decision was appropriate. Reviewing that history improves the process without pretending that the goal is to eliminate every exception.'
      ], subsections: [
        { heading: 'Test the loop with real examples', paragraphs: [
          'Use representative examples before launch: ordinary work, incomplete input, duplicate input, conflicting records, and a case that should be rejected. Check both the output and the operator experience. A workflow that catches an error but sends the alert to an unmonitored channel is not reliable.',
          'Repeat the examples after meaningful changes. Keep the tests small enough to run regularly and clear enough that a new operator can understand what they prove. This is how quality becomes an operating habit rather than a one-time launch event.'
        ] }
      ]},
      { heading: 'Make reliability maintainable', paragraphs: [
        'Name the owner of the quality loop and define when it is reviewed. Monitor unresolved exceptions, rejected outputs, repeated edits, and records that remain stuck. These are more useful than a single accuracy claim because they show where the workflow is asking people to compensate for its design.',
        'Document the boundaries. Explain what the automation may do, what requires approval, what happens when information is missing, and how to stop or correct it. A system is easier to trust when its limits are ordinary knowledge rather than tribal knowledge.'
      ], subsections: [
        { heading: 'Frequently asked questions', paragraphs: [], faq: [
          ['Does human review make automation pointless?', 'No. It concentrates human attention on the decisions that need it while automation handles preparation, routing, and repeatable checks. The goal is controlled leverage, not total removal of judgment.'],
          ['What should be logged?', 'Log the source record, generated or changed output, approval decision, exception reason, and responsible owner. Keep only what is appropriate for the business and its privacy obligations.'],
          ['When can a review gate be removed?', 'Only after repeated evidence shows the case is low risk, the inputs are reliable, and a recovery path exists. Removing a gate should be a deliberate change with a new acceptance check.']
        ] }
      ]}
    ]
  },
  'operator-dashboards': {
    sections: [
      { heading: 'A dashboard should help someone decide', paragraphs: [
        'A dashboard earns its place when an operator can look at it and know what deserves attention. Decorative charts may make a report feel complete, but a business view is useful only when its numbers connect to a decision, an owner, and a source record. The question is not how many metrics fit on the page; it is what action the page makes easier.',
        'Start with the decisions the team makes during a normal week. Which work is unassigned? Which customer is waiting? Which order is blocked? Which approval is late? Which margin or capacity condition requires a change? Build the view around those questions and remove metrics that do not change what someone does.'
      ], subsections: [
        { heading: 'Define the decision before the metric', paragraphs: [
          'For every displayed number, write the decision it supports and the record behind it. “Open opportunities” is a count; “which opportunities need an owner today?” is an operational question. The second question determines the fields, filters, and link behavior the dashboard needs.',
          'Give the metric a clear time and status definition. A total that mixes active, completed, and held records may look precise while hiding the work that matters. Consistent definitions are more important than visual variety.'
        ] }
      ]},
      { heading: 'Trace every number to its source', paragraphs: [
        'Source traceability is the difference between an operator dashboard and a presentation. An owner should be able to move from a metric to the records included in it, understand the last update, and see why a record is present. If the dashboard depends on a manual export, make that dependency visible rather than presenting the result as live.',
        'Reconcile the data model before adding visual polish. Decide which system owns the customer, order, job, or payment record, and how duplicate or incomplete records are treated. A chart cannot repair ambiguous identity or status.'
      ], subsections: [
        { heading: 'Use exceptions as the primary view', paragraphs: [
          'Routine completed work may be reassuring, but exceptions are where the operator can create value. Surface stalled, unassigned, overdue, incomplete, or contradictory records. Let the user filter by owner, process state, and next action so the view remains useful during a busy day.',
          'Do not turn every irregularity into an alarm. Define which exceptions need immediate action and which can be reviewed later. A queue that is always red teaches people to ignore the color.'
        ] }
      ]},
      { heading: 'Design for the operator’s next move', paragraphs: [
        'A useful card or table should answer three things: what happened, why it matters, and what to do next. Include the context needed for the action and link to the record where the work can be completed. Avoid forcing the operator to copy an identifier into another system just to investigate a metric.',
        'Keep the first view calm. Put the highest-value exceptions at the top and provide deliberate drill-downs for detail. The dashboard should support a short daily review as well as a deeper investigation when something is unusual.'
      ], subsections: [
        { heading: 'Check the dashboard with real decisions', paragraphs: [
          'Ask an operator to use the dashboard while handling ordinary work. Watch where they hesitate, what they open next, and which information they still retrieve from another source. Those observations are more valuable than asking whether the layout looks good.',
          'Test stale, missing, duplicate, and changed records. A view that is useful only when every source is perfect is not ready for operational use. Make freshness and limitations visible so the user can judge the information responsibly.'
        ] }
      ]},
      { heading: 'Keep metrics governed as the business changes', paragraphs: [
        'Every metric needs an owner and a definition. When a process changes, review whether the metric still represents the same decision. Retire metrics that no longer guide action; leaving them in place creates false confidence and makes the dashboard harder to read.',
        'Review access and data exposure as part of dashboard maintenance. Operational convenience should not make sensitive customer, financial, or employee information visible to people who do not need it. A focused dashboard is often easier to secure because it exposes less by default.'
      ], subsections: [
        { heading: 'Frequently asked questions', paragraphs: [], faq: [
          ['How many metrics should a dashboard have?', 'Only the metrics tied to decisions the audience must make. A small set of traceable, actionable views is stronger than a crowded collection of totals.'],
          ['Should a dashboard be real time?', 'Only when the decision requires it. Define the freshness needed for the process and show when the data was last updated.'],
          ['What is a decorative metric?', 'A number that looks informative but does not lead to a clear decision, source record, or next action. It may belong in analysis, but not necessarily on the operator’s primary screen.']
        ] }
      ]}
    ]
  },
  'when-saas-falls-short': {
    sections: [
      { heading: 'SaaS is convenient until the process bends around it', paragraphs: [
        'Subscription software is often the right starting point. It provides a maintained baseline, familiar patterns, and a faster route to common capabilities. The problem appears when the business process becomes distinctive and the team must change its operation to fit the product. Workarounds accumulate, data is copied between platforms, and the subscription stack becomes a second process the team must operate.',
        'The decision to build should not come from frustration alone. It should come from a clear mismatch between the business requirement and the available product behavior. Identify the repeated work, the constraint, and the consequence. If the workaround is occasional and harmless, keep the product. If it affects core delivery, data ownership, or margin, investigate a targeted custom system.'
      ], subsections: [
        { heading: 'Name the constraint precisely', paragraphs: [
          '“The software is limited” is not specific enough. State what the team needs to do, what the product permits, and the workaround required. The constraint may be a rigid workflow, a missing integration, unclear ownership of data, an approval model that cannot be represented, or a cost structure that grows with an operational behavior.',
          'Separate preference from necessity. A different color or layout may be a preference; losing the ability to track a critical handoff is a business constraint. Precise language keeps the build-or-buy decision grounded.'
        ] }
      ]},
      { heading: 'Calculate the real cost of workarounds', paragraphs: [
        'The subscription price is only one part of the cost. Include repeated entry, reconciliation, training, reporting delays, integration maintenance, and the consequences of unclear or inaccessible data. Also count the opportunity cost of asking skilled people to keep a fragile workaround alive.',
        'Use examples from the process rather than invented return-on-investment claims. Show how an order, customer, job, or approval moves through the current stack. The goal is to make the friction visible enough that a reasonable decision can be made, not to justify custom software at any price.'
      ], subsections: [
        { heading: 'Prefer a targeted system to a replacement fantasy', paragraphs: [
          'A custom tool does not need to replace every product. It can own the distinctive workflow while exchanging stable data with systems that already work. A focused portal, dispatch board, internal tool, or integration may solve the constraint without taking on an entire platform’s responsibilities.',
          'Define the boundary early. Decide which records the custom system owns, which system remains authoritative elsewhere, and how changes are synchronized. Ambiguous ownership recreates the same data silos under a new name.'
        ] }
      ]},
      { heading: 'Design for ownership and maintenance', paragraphs: [
        'Custom software is an operational asset, not a finished artifact. It needs an owner, a documented workflow, clear access rules, and a way to handle exceptions. The build plan should include how a new team member learns the process and how the business requests a change.',
        'Keep the architecture proportionate. Use familiar components where they are adequate, isolate the business-specific rules, and avoid creating a bespoke layer for a problem a reliable existing service already solves. The goal is fit, not novelty.'
      ], subsections: [
        { heading: 'Prove the boundary before expanding it', paragraphs: [
          'Start with one high-value workflow and its real records. Test ordinary and exceptional cases, confirm ownership, and compare the new path with the old workaround. If the first boundary is not understood, adding more modules will only make the uncertainty more expensive.',
          'Review the system with the operators who will maintain it. Their questions reveal missing states, permissions, and recovery paths before those gaps become production support issues.'
        ] }
      ]},
      { heading: 'A responsible build-or-buy decision', paragraphs: [
        'Buy when the process is common, the product fits the important constraints, and the business benefits from the vendor’s maintenance. Build when the workflow itself is a differentiator, the workarounds create material risk or drag, and the organization is willing to own the resulting system.',
        'Sometimes the answer is to change the process instead. A business should not customize software merely to preserve a habit that no longer serves the customer or operator. Document the tradeoff, choose the smallest durable path, and make the owner explicit.'
      ], subsections: [
        { heading: 'Frequently asked questions', paragraphs: [], faq: [
          ['When is SaaS still the better choice?', 'When the process is common, the product’s constraints do not affect core work, and the business would rather rely on a maintained service than own the capability.'],
          ['Does custom software require replacing existing tools?', 'No. A focused system can own a distinctive workflow and integrate with stable tools. Clear data ownership and boundaries are essential.'],
          ['What should be proven first?', 'The smallest workflow where the current workaround creates meaningful friction and the new system can be evaluated with real records and acceptance checks.']
        ] }
      ]}
    ]
  },
  'long-term-system-adoption': {
    sections: [
      { heading: 'Launch is a handoff, not the finish line', paragraphs: [
        'A system can be technically complete and operationally unused. Adoption is not a personality test or a training problem alone; it is evidence that the workflow fits the work, has a clear owner, and gives people enough confidence to rely on it. If the system asks operators to maintain parallel notes or guess what a status means, resistance is a rational response.',
        'Plan adoption while the workflow is being designed. The people who operate it should understand the trigger, the next action, the exception path, and the definition of done. That knowledge belongs in the product experience and the playbook, not only in a launch meeting.'
      ], subsections: [
        { heading: 'Name an internal owner', paragraphs: [
          'Every deployed workflow needs someone who can answer ordinary questions, notice exceptions, and coordinate changes. The owner does not need to be a developer. They do need enough context to tell whether a problem is data, process, access, or a genuine software defect.',
          'Ownership should be visible in the workflow itself. A record without an owner becomes a shared responsibility that nobody can confidently act on. A system that makes ownership clear is easier to adopt because people know where the next decision lives.'
        ] }
      ]},
      { heading: 'Write playbooks people can use', paragraphs: [
        'A playbook should describe the normal path, the important exceptions, and what completion looks like. It should use the same terms and states as the system. Avoid a long manual that explains every screen but not what the operator is trying to accomplish.',
        'Use real examples. Show how a request enters, how the owner responds, what happens when information is missing, and how the record is closed. Examples help new operators build a mental model and help existing operators recognize when a case falls outside the normal path.'
      ], subsections: [
        { heading: 'Make feedback part of the operating rhythm', paragraphs: [
          'Schedule a short review after launch and again when the process changes. Ask what people still do outside the system, which states are unclear, and which alerts are ignored. Those answers are adoption evidence, not complaints to dismiss.',
          'Prioritize improvements that remove repeated confusion or restore trust. A small change to a label, required field, or exception message can matter more than a large new feature if it helps the team complete the existing workflow correctly.'
        ] }
      ]},
      { heading: 'Design maintenance before it is urgent', paragraphs: [
        'Systems outlive their first assumptions. Owners change, services evolve, and the business adds new cases. Document the integrations, important rules, access responsibilities, and acceptance checks so the workflow can be maintained without depending on one person’s memory.',
        'Keep a change boundary. Not every request belongs in the system, and not every shortcut deserves preservation. Review changes against the original operational purpose and the proof that made the workflow trustworthy.'
      ], subsections: [
        { heading: 'Watch for early signs of abandonment', paragraphs: [
          'Parallel spreadsheets, private status lists, repeated questions, and manually bypassed states are signals. Investigate them before adding more training. The system may be missing context, making the next action unclear, or creating work that has no value to the operator.',
          'Make recovery easy. If an operator makes a mistake, they should know how to correct the record or escalate it. Fear of damaging an opaque system is a powerful adoption barrier.'
        ] }
      ]},
      { heading: 'Adoption is an engineering responsibility', paragraphs: [
        'Good adoption comes from a coherent workflow, clear ownership, useful feedback, and maintainable documentation. Training helps, but it cannot compensate for a system that does not represent the work. Treat usage patterns as product evidence and keep improving the path that operators actually need.',
        'The goal is not to force everyone into a tool. It is to make the agreed way of working the easiest reliable path, with enough visibility that owners can improve it as the business changes.'
      ], subsections: [
        { heading: 'Frequently asked questions', paragraphs: [], faq: [
          ['Who should own adoption?', 'A business-side operator should own the workflow outcome, with technical support available for defects and changes. Ownership should be close to the work.'],
          ['How much documentation is enough?', 'Enough to explain the normal path, important exceptions, ownership, and recovery. Use real examples and keep it aligned with the interface.'],
          ['What if people keep using the old process?', 'Observe why. Parallel work often shows a missing field, unclear state, poor access, or a process requirement the new design did not address.']
        ] }
      ]}
    ]
  },
  'proof-over-promises': {
    sections: [
      { heading: 'A deliverable is a claim that needs evidence', paragraphs: [
        'Software work is often described with words such as intelligent, seamless, scalable, or production-ready. Those words can be useful shorthand, but they are not proof. A business owner needs to know what the system does, under which conditions, who can operate it, and how a failure will be noticed and corrected.',
        'Acceptance criteria turn a promise into an observable agreement. They describe the behavior that matters before implementation begins. This protects both sides: the buyer can evaluate the result, and the builder can focus on the workflow rather than an expanding set of impressions.'
      ], subsections: [
        { heading: 'Write criteria in the language of work', paragraphs: [
          'A strong criterion names the trigger, the record, the expected state, and the evidence. “When a valid inquiry is submitted, one owned record appears with the source context and a follow-up task” is testable. “Improve lead management with AI” is not.',
          'Include negative and incomplete cases. What happens when the required field is missing, the record is duplicated, the integration is unavailable, or the reviewer rejects the draft? A system that only proves the happy path is not proven ready.'
        ] }
      ]},
      { heading: 'Inspect architecture, not just the demo', paragraphs: [
        'A demo shows a moment. A deliverable should show how data moves, where state is stored, what permissions apply, and how the workflow behaves after the first successful interaction. Ask to see the source record, the owner, the audit trail, and the exception path.',
        'The architecture need not be large. It does need to be explainable. If no one can say which system is authoritative or how a failed handoff is recovered, polished screens do not remove the operational risk.'
      ], subsections: [
        { heading: 'Look for maintainability signals', paragraphs: [
          'Clear names, scoped responsibilities, documented setup, and repeatable tests are practical evidence. So is a change that can be made without rewriting unrelated behavior. The goal is not to demand a particular stack; it is to ensure the business is not receiving an artifact only its original author can operate.',
          'Ask what happens when an integration changes, a user leaves, or a new case appears. A maintainable system has an answer, even if the answer is a planned manual review.'
        ] }
      ]},
      { heading: 'Avoid false precision and unsupported promises', paragraphs: [
        'A precise number can still be unhelpful if its measurement is unclear. Be cautious with guaranteed savings, arbitrary accuracy claims, and timelines that ignore data or approval dependencies. Define what will be measured, how it will be observed, and what is outside the system’s control.',
        'Honest scope is a feature. If a workflow is proven only for one process, say so. If a provider is not configured, do not present a demo button as a working integration. Clear boundaries make future expansion safer because the next decision starts from evidence.'
      ], subsections: [
        { heading: 'Use a proof packet', paragraphs: [
          'Keep the acceptance cases, screenshots or recordings where appropriate, test results, architecture notes, and operating guide together. A proof packet gives the owner a way to verify the system later instead of relying on launch memory.',
          'Review the packet with the operator who will own the workflow. Their sign-off should mean they can recognize the expected behavior and know what to do when the system reaches an exception state.'
        ] }
      ]},
      { heading: 'Define done before the work begins', paragraphs: [
        'A credible software deliverable has a shared definition of done: behavior, data, access, testing, documentation, and ownership. Agree on those elements before implementation. It reduces ambiguity without pretending that every future request can be predicted.',
        'Proof does not eliminate uncertainty. It gives the business a responsible way to manage it. When the evidence is incomplete, the correct next step may be a narrower pilot, a human review, or more observation—not a larger promise.'
      ], subsections: [
        { heading: 'Frequently asked questions', paragraphs: [], faq: [
          ['What should acceptance criteria include?', 'The trigger, expected behavior, record or output, owner, and evidence of completion. Include incomplete, duplicate, rejected, and failure cases when they matter.'],
          ['Is a demo useful?', 'Yes, as one piece of evidence. Pair it with source records, exception behavior, tests, access rules, and documentation so the business can judge the system beyond the demo path.'],
          ['How do we handle changing scope?', 'Record the change, its effect on the acceptance criteria, and the new decision about priority or timing. Avoid silently treating a new promise as part of the original proof.']
        ] }
      ]}
    ]
  },
  'tailoring-automation-trade-operations': {
    sections: [
      { heading: 'Different trades share the same operational friction', paragraphs: [
        'An auto repair shop, property team, rental operator, or field service company may use different language and tools, but the work often follows a similar path: an inquiry arrives, details are collected, work is scheduled, the field team updates status, and the back office prepares payment or follow-up. The opportunity is to standardize the handoffs without pretending that every trade has the same rules.',
        'A useful system respects the working day. It reduces missed inquiries and repeated administration while keeping the operator’s view simple. The design should follow the customer and job records through the process, not force the field team to maintain an abstract collection of disconnected modules.'
      ], subsections: [
        { heading: 'Begin with capture and routing', paragraphs: [
          'Capture the request once and preserve the context that affects the next decision: service type, location, timing, customer details, and relevant constraints. Route it to an owner or queue with a state that says whether more information is needed, a quote is being prepared, or scheduling can begin.',
          'The system should distinguish a new inquiry from an active job. That separation keeps the pipeline useful and prevents a request from disappearing into a calendar before its requirements are understood.'
        ] }
      ]},
      { heading: 'Connect scheduling, field work, and the back office', paragraphs: [
        'Scheduling is not complete when an appointment appears on a calendar. The field worker needs the right job context, the customer needs a reliable expectation, and the back office needs a record that can support billing or follow-up. A connected workflow keeps those states aligned while allowing each role to see only what it needs.',
        'Use clear completion events. A job marked complete should expose the information needed for review, invoice preparation, inventory adjustment, or customer communication. If the field record is incomplete, hold the next step visibly rather than creating a misleading completed state.'
      ], subsections: [
        { heading: 'Design for unreliable connectivity and real conditions', paragraphs: [
          'Field work does not happen in an ideal office environment. Interfaces should minimize typing, make the next action obvious, and tolerate delayed updates where the process permits it. When a record cannot be synchronized immediately, show the pending state and give the operator a safe recovery path.',
          'Keep exceptions close to the job. A missed part, changed scope, customer absence, or payment issue should not disappear into an unrelated chat. The person who can resolve it needs the context and the authority to move the record forward.'
        ] }
      ]},
      { heading: 'Automate routine follow-up carefully', paragraphs: [
        'Confirmations, quote reminders, invoice notices, and status updates are useful when their trigger and audience are reliable. They should reflect the actual state of the job and provide a clear response path. A message sent from a stale record creates more support work than it removes.',
        'Keep customer-facing commitments reviewable when the underlying details can change. Templates can preserve consistency, while an operator approves unusual timing, pricing, scope, or service conditions.'
      ], subsections: [
        { heading: 'Keep trade-specific rules explicit', paragraphs: [
          'A shared core does not mean a generic workflow. Capture the rules that differ by service, location, inventory, approval authority, or payment method. Make those rules visible and testable rather than hiding them in a fragile collection of automations.',
          'Start with one trade or job type, prove the handoffs, and then reuse the stable pieces. Expansion should be driven by observed similarity, not by assuming that a label such as “field service” explains every requirement.'
        ] }
      ]},
      { heading: 'Build the operational loop around the customer record', paragraphs: [
        'A connected system gives the business one understandable history: what was requested, what was scheduled, what happened in the field, what was approved, and what remains. That history helps teams respond quickly without asking customers to repeat themselves or searching across private conversations.',
        'Prove the workflow with real variations. Include rescheduling, incomplete intake, changed scope, a missed appointment, a part or resource constraint, and a payment exception. Those cases are where the quality of the operational design becomes visible.'
      ], subsections: [
        { heading: 'Frequently asked questions', paragraphs: [], faq: [
          ['Should every field team use the same interface?', 'They should share the same essential records and states, but the interface can be tailored to the role and working conditions. Consistency matters most at the handoffs.'],
          ['What should be automated first?', 'Start with capture, routing, scheduling confirmations, or status handoffs where the rule is clear and the outcome can be verified.'],
          ['How do we protect service quality?', 'Keep source context, approval gates, and exception ownership visible. Automation should reduce administration without hiding changes in scope or customer expectations.']
        ] }
      ]}
    ]
  }
};
