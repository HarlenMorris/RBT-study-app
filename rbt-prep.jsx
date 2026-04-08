import { useState, useEffect, useCallback, useMemo } from "react";

const QUESTIONS = [
  // ============ A: MEASUREMENT ============
  { id:"A-01-001", domain:"A", taskItem:"A-01", difficulty:"basic", question:"What is the best definition of 'behavior' in ABA?", options:["A) An internal feeling or emotion","B) An observable and measurable action of an organism","C) A thought process that leads to action","D) Any movement a person makes involuntarily"], correct:"B", explanation:"In ABA, behavior must be observable and measurable. Internal states like feelings (A) and thoughts (C) don't qualify. Involuntary reflexes (D) are typically not the focus of RBT interventions." },
  { id:"A-01-002", domain:"A", taskItem:"A-01", difficulty:"intermediate", question:"Before collecting data, the RBT should:", options:["A) Design a new data collection system","B) Review the data sheet, know the target behavior definition, and have materials ready","C) Wait for the client to exhibit the behavior first","D) Ask the client's parent what to measure"], correct:"B", explanation:"Preparing for data collection (A-01) means reviewing operational definitions, understanding which measurement to use, and having data sheets/tools ready before the session begins." },
  { id:"A-01-003", domain:"A", taskItem:"A-01", difficulty:"basic", question:"An operational definition of behavior should be:", options:["A) Vague enough to cover many behaviors","B) Based on the client's internal feelings","C) Clear, objective, and measurable so multiple observers agree","D) Changed each session to keep things fresh"], correct:"C", explanation:"Operational definitions must be observable and measurable so that anyone reading them can identify the behavior the same way. This ensures reliable data collection across observers." },
  { id:"A-02-001", domain:"A", taskItem:"A-02", difficulty:"basic", question:"Continuous measurement records:", options:["A) Every instance of the target behavior","B) Only behaviors during a sample period","C) Behaviors rated on a scale","D) Behaviors at set intervals"], correct:"A", explanation:"Continuous measurement (event recording) captures every occurrence. Interval-based methods (D) and time sampling are discontinuous. Rating scales (C) are indirect measures." },
  { id:"A-02-002", domain:"A", taskItem:"A-02", difficulty:"intermediate", question:"A client hits the table 3 times in 10 minutes. What dimension of behavior is being measured?", options:["A) Duration","B) Latency","C) Rate/Frequency","D) Magnitude"], correct:"C", explanation:"Rate is the count of behavior per unit of time (3 hits / 10 min). Duration measures how long behavior lasts, latency measures time from SD to response, and magnitude measures intensity." },
  { id:"A-02-003", domain:"A", taskItem:"A-02", difficulty:"intermediate", question:"Latency measures:", options:["A) How long a behavior lasts once it starts","B) The time between the SD and the onset of the response","C) The number of times a behavior occurs","D) The force or intensity of a behavior"], correct:"B", explanation:"Latency = time from the cue/instruction (SD) to when the behavior begins. Duration (A) measures how long the behavior continues. Frequency (C) counts occurrences." },
  { id:"A-02-004", domain:"A", taskItem:"A-02", difficulty:"advanced", question:"Interresponse time (IRT) measures:", options:["A) The time between the SD and the response","B) The time between two consecutive instances of the same behavior","C) How long the behavior lasts","D) The number of responses per minute"], correct:"B", explanation:"IRT is the elapsed time between two successive responses of the same behavior. This is different from latency (time from SD to response) and duration (how long one response lasts)." },
  { id:"A-03-001", domain:"A", taskItem:"A-03", difficulty:"intermediate", question:"An RBT uses a timer and records whether a behavior occurs at ANY point during each 15-second window. This is:", options:["A) Whole interval recording","B) Momentary time sampling","C) Partial interval recording","D) Event recording"], correct:"C", explanation:"Partial interval: record if behavior occurred at any point during the interval. Whole interval (A) requires behavior for the entire interval. Momentary time sampling (B) checks only at the moment the interval ends." },
  { id:"A-03-002", domain:"A", taskItem:"A-03", difficulty:"intermediate", question:"Momentary time sampling involves:", options:["A) Recording whether the behavior is occurring at the exact moment the interval ends","B) Recording every instance of behavior","C) Recording if behavior occurred at any time during the interval","D) Recording how long the behavior lasted"], correct:"A", explanation:"MTS only checks if the behavior is happening at the precise moment the interval ends. It tends to be the most accurate discontinuous method for estimating duration-based behaviors." },
  { id:"A-03-003", domain:"A", taskItem:"A-03", difficulty:"advanced", question:"Which discontinuous method tends to OVERESTIMATE behavior occurrence?", options:["A) Whole interval recording","B) Momentary time sampling","C) Partial interval recording","D) Permanent product recording"], correct:"C", explanation:"Partial interval overestimates because even one brief occurrence in the interval gets scored as if behavior occurred the whole time. Whole interval (A) tends to underestimate." },
  { id:"A-04-001", domain:"A", taskItem:"A-04", difficulty:"basic", question:"Permanent product recording involves:", options:["A) Videotaping all sessions","B) Measuring the tangible outcome of a behavior after it occurs","C) Recording behavior only when it produces noise","D) Asking the client to self-report"], correct:"B", explanation:"Permanent product measures the lasting result of behavior (e.g., completed worksheets, broken items). It doesn't require direct observation of the behavior itself." },
  { id:"A-05-001", domain:"A", taskItem:"A-05", difficulty:"basic", question:"Why is graphing data important in ABA?", options:["A) It makes sessions look professional","B) It allows visual analysis of trends and progress over time","C) It is only necessary for research, not clinical work","D) It replaces the need for a BCBA to review data"], correct:"B", explanation:"Graphing allows the treatment team to visually analyze level, trend, and variability of behavior data. This informs clinical decisions about whether to continue, modify, or discontinue interventions." },
  { id:"A-05-002", domain:"A", taskItem:"A-05", difficulty:"intermediate", question:"When entering data into a graph, the RBT should:", options:["A) Only graph data points that show improvement","B) Accurately plot all collected data, including sessions with no progress","C) Round data up to make the graph look better","D) Wait until the end of the month to enter all data at once"], correct:"B", explanation:"Data integrity is critical. All data must be recorded accurately and completely, even when it shows no progress or regression. Selective or delayed entry compromises clinical decisions." },
  { id:"A-06-001", domain:"A", taskItem:"A-06", difficulty:"basic", question:"Which is the BEST example of describing behavior in observable and measurable terms?", options:["A) 'Client was angry during session'","B) 'Client hit the table with an open hand 4 times in 10 minutes'","C) 'Client seemed frustrated'","D) 'Client had a bad attitude'"], correct:"B", explanation:"Observable = you can see it (hitting). Measurable = you can count/time it (4 times in 10 min). Options A, C, D describe internal states or subjective interpretations, not measurable behavior." },

  // ============ B: ASSESSMENT ============
  { id:"B-01-001", domain:"B", taskItem:"B-01", difficulty:"basic", question:"What is a preference assessment used for?", options:["A) To diagnose a disorder","B) To identify potential reinforcers","C) To determine the function of behavior","D) To measure baseline behavior"], correct:"B", explanation:"Preference assessments (paired stimulus, MSWO, free operant) identify items/activities the client prefers, which may function as reinforcers. Functional assessments (C) determine behavior function." },
  { id:"B-01-002", domain:"B", taskItem:"B-01", difficulty:"intermediate", question:"During a paired stimulus preference assessment, the RBT should:", options:["A) Present all items at once and let the client choose","B) Present two items at a time and record which is selected","C) Ask the client's caregiver what the client likes","D) Let the client play freely and observe"], correct:"B", explanation:"Paired stimulus (Fisher et al.) presents items in pairs systematically. Free operant (D) involves free access observation. Presenting all at once is a multiple stimulus method (A). Caregiver report (C) is an indirect assessment." },
  { id:"B-01-003", domain:"B", taskItem:"B-01", difficulty:"intermediate", question:"A free operant preference assessment involves:", options:["A) Presenting items two at a time","B) Asking the client to rank their favorite items","C) Providing free access to items and recording engagement duration","D) Removing items one at a time from an array"], correct:"C", explanation:"Free operant: the client has unrestricted access to multiple items/activities and the observer records how much time is spent with each. Higher engagement = higher preference." },
  { id:"B-01-004", domain:"B", taskItem:"B-01", difficulty:"advanced", question:"In a multiple stimulus without replacement (MSWO) assessment:", options:["A) All items remain in the array after each selection","B) The selected item is removed from the array before the next trial","C) Only two items are presented at a time","D) The client is asked to verbally rank preferences"], correct:"B", explanation:"MSWO presents an array of items; after the client selects one, it is removed. This prevents choosing the same item repeatedly and produces a rank-ordered preference hierarchy." },
  { id:"B-02-001", domain:"B", taskItem:"B-02", difficulty:"basic", question:"An RBT assists with individualized assessment procedures by:", options:["A) Independently designing the assessment","B) Collecting data as directed by the BCBA during the assessment","C) Determining the function and writing the behavior plan","D) Choosing which assessment to conduct"], correct:"B", explanation:"RBTs assist with assessments (curriculum-based, developmental, social skills) under BCBA direction. Designing, determining function, and choosing methods are BCBA responsibilities." },
  { id:"B-03-001", domain:"B", taskItem:"B-03", difficulty:"intermediate", question:"An RBT assists with a functional behavior assessment by:", options:["A) Independently designing the assessment","B) Collecting ABC data as directed by the BCBA","C) Determining the function and writing the behavior plan","D) Choosing which assessment to conduct"], correct:"B", explanation:"RBTs collect data (like ABC: Antecedent-Behavior-Consequence) under BCBA supervision. Designing assessments, determining function, and choosing methods are BCBA responsibilities." },
  { id:"B-03-002", domain:"B", taskItem:"B-03", difficulty:"intermediate", question:"ABC data collection stands for:", options:["A) Analysis, Behavior, Correction","B) Antecedent, Behavior, Consequence","C) Assessment, Baseline, Criteria","D) Applied, Behavioral, Clinical"], correct:"B", explanation:"ABC = Antecedent (what happened before), Behavior (what the client did), Consequence (what happened after). This is a key data collection method for functional assessments." },

  // ============ C: SKILL ACQUISITION ============
  { id:"C-01-001", domain:"C", taskItem:"C-01", difficulty:"basic", question:"A skill acquisition plan typically includes:", options:["A) Only the target behavior","B) The target, goal criteria, measurement system, materials, and teaching procedures","C) Just a list of reinforcers","D) Only the prompt hierarchy"], correct:"B", explanation:"A comprehensive skill acquisition plan outlines what is being taught, how mastery is measured, data collection methods, materials needed, and step-by-step teaching procedures." },
  { id:"C-02-001", domain:"C", taskItem:"C-02", difficulty:"basic", question:"Discrete trial training (DTT) includes which sequence?", options:["A) Reinforcer -> Response -> SD","B) SD -> Response -> Consequence","C) Response -> SD -> Reinforcer","D) Consequence -> SD -> Response"], correct:"B", explanation:"DTT follows a three-term contingency: the discriminative stimulus (SD) is presented, the learner responds, then a consequence (reinforcement or correction) follows." },
  { id:"C-02-002", domain:"C", taskItem:"C-02", difficulty:"intermediate", question:"Which component is NOT part of a discrete trial?", options:["A) Discriminative stimulus (SD)","B) Client's response","C) Preference assessment","D) Consequence/feedback"], correct:"C", explanation:"A discrete trial has: SD (instruction), response, consequence, and inter-trial interval. Preference assessments are separate procedures done to identify reinforcers, not part of individual trials." },
  { id:"C-03-001", domain:"C", taskItem:"C-03", difficulty:"intermediate", question:"Natural environment teaching (NET) differs from DTT primarily because NET:", options:["A) Uses only tangible reinforcers","B) Is led by the learner's motivation in natural contexts","C) Does not use any prompts","D) Requires a table and chair setup"], correct:"B", explanation:"NET capitalizes on the learner's naturally occurring motivation and teaches in context. It still uses prompts (C) and can use various reinforcers. DTT is more structured (D)." },
  { id:"C-03-002", domain:"C", taskItem:"C-03", difficulty:"basic", question:"An example of naturalistic teaching would be:", options:["A) Running flashcard drills at a table","B) Teaching a child to request 'juice' when they reach for it at snack time","C) Having the child repeat words 10 times in a row","D) Using only error correction procedures"], correct:"B", explanation:"Naturalistic/incidental teaching uses naturally occurring opportunities and the learner's motivation (reaching for juice) to teach skills in context." },
  { id:"C-04-001", domain:"C", taskItem:"C-04", difficulty:"basic", question:"What is a prompt?", options:["A) A consequence delivered after a correct response","B) A supplementary stimulus that increases the likelihood of a correct response","C) A naturally occurring cue in the environment","D) A type of punishment procedure"], correct:"B", explanation:"Prompts are added antecedent stimuli that help evoke the correct response. They are faded over time to promote independence. Reinforcement (A) is a consequence, not an antecedent." },
  { id:"C-04-002", domain:"C", taskItem:"C-04", difficulty:"intermediate", question:"Which is the MOST intrusive prompt?", options:["A) Gestural","B) Verbal","C) Full physical guidance","D) Visual/positional"], correct:"C", explanation:"Prompt hierarchy from most to least intrusive: full physical → partial physical → model → gestural → verbal → visual. Full physical guidance provides the most assistance." },
  { id:"C-05-001", domain:"C", taskItem:"C-05", difficulty:"intermediate", question:"Most-to-least prompting involves:", options:["A) Starting with no help and adding prompts as needed","B) Starting with the most intrusive prompt and systematically fading","C) Using only gestural prompts","D) Letting the client choose their prompt level"], correct:"B", explanation:"Most-to-least (MTL) starts with full physical prompts and fades to less intrusive ones as the learner demonstrates mastery. Least-to-most (A) works in reverse." },
  { id:"C-05-002", domain:"C", taskItem:"C-05", difficulty:"intermediate", question:"Least-to-most prompting begins with:", options:["A) Full physical guidance","B) The least intrusive prompt, increasing only if the learner doesn't respond correctly","C) No prompt at all and never adding one","D) Always using a model prompt"], correct:"B", explanation:"Least-to-most gives the learner a chance to respond with minimal assistance first. If they don't respond correctly, more intrusive prompts are provided in a hierarchy." },
  { id:"C-05-003", domain:"C", taskItem:"C-05", difficulty:"advanced", question:"A time delay prompting procedure involves:", options:["A) Eliminating all prompts immediately","B) Gradually increasing the time between the SD and the prompt to give the learner a chance to respond independently","C) Decreasing the time between trials","D) Using only physical prompts"], correct:"B", explanation:"Time delay starts with a 0-second delay (prompt immediately after SD) then gradually increases the delay, giving the learner an opportunity to respond before the prompt is delivered." },
  { id:"C-06-001", domain:"C", taskItem:"C-06", difficulty:"basic", question:"Task analysis with forward chaining teaches:", options:["A) The last step first, with all prior steps prompted","B) All steps simultaneously","C) The first step independently, with remaining steps prompted","D) Only the most difficult step"], correct:"C", explanation:"Forward chaining teaches the first step to mastery, then adds subsequent steps. Backward chaining (A) teaches the last step first. Total task presentation (B) practices all steps each trial." },
  { id:"C-06-002", domain:"C", taskItem:"C-06", difficulty:"intermediate", question:"Backward chaining involves:", options:["A) Teaching the first step and prompting the rest","B) Teaching the LAST step to independence first, prompting all earlier steps","C) Teaching all steps at once","D) Skipping steps the client finds difficult"], correct:"B", explanation:"Backward chaining: the RBT completes all steps except the last, which the learner does independently. Once mastered, the second-to-last step is taught, and so on." },
  { id:"C-06-003", domain:"C", taskItem:"C-06", difficulty:"basic", question:"A task analysis is:", options:["A) A test to measure intelligence","B) Breaking a complex skill into smaller, teachable steps","C) A type of preference assessment","D) A method for reducing problem behavior"], correct:"B", explanation:"Task analysis identifies and sequences every step needed to complete a complex skill (e.g., handwashing: turn on water, wet hands, apply soap, scrub, rinse, dry)." },
  { id:"C-07-001", domain:"C", taskItem:"C-07", difficulty:"basic", question:"A contingency in ABA refers to:", options:["A) An emergency procedure","B) An if-then relationship between behavior and its consequence","C) A backup plan for when therapy doesn't work","D) The client's diagnosis"], correct:"B", explanation:"A contingency is an if-then relationship: IF the behavior occurs, THEN a specific consequence follows. This is fundamental to how reinforcement and punishment work." },
  { id:"C-07-002", domain:"C", taskItem:"C-07", difficulty:"intermediate", question:"On a fixed ratio 5 (FR5) schedule, reinforcement is delivered:", options:["A) After every 5 minutes","B) After every 5th correct response","C) After an average of 5 responses","D) After the first response in 5 minutes"], correct:"B", explanation:"Fixed ratio (FR) delivers reinforcement after a set number of responses. FR5 = reinforce every 5th response. Variable ratio (C) averages. Fixed interval (A/D) is time-based." },
  { id:"C-07-003", domain:"C", taskItem:"C-07", difficulty:"intermediate", question:"Which reinforcement schedule produces the HIGHEST, most consistent rate of responding?", options:["A) Fixed interval","B) Variable interval","C) Fixed ratio","D) Variable ratio"], correct:"D", explanation:"Variable ratio (VR) produces high, steady response rates because the learner can't predict which response will be reinforced (think: slot machines). Fixed schedules produce post-reinforcement pauses." },
  { id:"C-07-004", domain:"C", taskItem:"C-07", difficulty:"basic", question:"Positive reinforcement occurs when:", options:["A) Something is removed and behavior increases","B) Something is added following a behavior and the behavior increases in the future","C) A behavior decreases over time","D) The client feels happy"], correct:"B", explanation:"Positive reinforcement = adding a stimulus after a behavior that increases the future likelihood of that behavior. Negative reinforcement (A) removes something. Punishment (C) decreases behavior." },
  { id:"C-07-005", domain:"C", taskItem:"C-07", difficulty:"intermediate", question:"Negative reinforcement involves:", options:["A) Punishing the client","B) Removing or reducing an aversive stimulus contingent on behavior, increasing that behavior","C) Taking away a preferred item","D) Ignoring the behavior"], correct:"B", explanation:"Negative reinforcement INCREASES behavior by removing something aversive (e.g., fastening seatbelt removes the beeping). It is NOT punishment. Negative = removal; Reinforcement = behavior increases." },
  { id:"C-08-001", domain:"C", taskItem:"C-08", difficulty:"basic", question:"Generalization occurs when:", options:["A) A behavior only occurs in the training setting","B) A learned behavior occurs in new settings, with new people, or with new materials","C) A behavior stops occurring","D) A new behavior replaces an old one"], correct:"B", explanation:"Generalization means the skill transfers across untrained conditions: different settings, people, materials, or times. If behavior only occurs in training (A), generalization has not been achieved." },
  { id:"C-08-002", domain:"C", taskItem:"C-08", difficulty:"intermediate", question:"To promote generalization, an RBT might:", options:["A) Always use the same materials and setting","B) Train with multiple exemplars across settings, people, and materials","C) Only practice skills during structured sessions","D) Avoid using natural reinforcers"], correct:"B", explanation:"Training across multiple exemplars (different materials, people, settings) promotes generalization. Using only one setting/material set (A) limits transfer of skills." },
  { id:"C-09-001", domain:"C", taskItem:"C-09", difficulty:"basic", question:"Maintenance of a behavior means:", options:["A) The behavior continues after formal training ends","B) The behavior only occurs when prompted","C) The behavior gets worse over time","D) The behavior only occurs in one setting"], correct:"A", explanation:"Maintenance = the behavior persists over time without continued direct training. This is a critical goal in ABA: skills should maintain after interventions are reduced or removed." },
  { id:"C-10-001", domain:"C", taskItem:"C-10", difficulty:"basic", question:"Shaping involves:", options:["A) Reinforcing the exact target behavior from the start","B) Reinforcing successive approximations toward a target behavior","C) Punishing incorrect responses","D) Modeling the behavior and hoping the client copies it"], correct:"B", explanation:"Shaping reinforces closer and closer approximations of the desired behavior. It's used when the target behavior doesn't yet exist in the learner's repertoire." },
  { id:"C-11-001", domain:"C", taskItem:"C-11", difficulty:"basic", question:"A token economy is an example of:", options:["A) Unconditioned reinforcement","B) A conditioned reinforcement system where tokens are exchanged for backup reinforcers","C) A punishment procedure","D) An extinction procedure"], correct:"B", explanation:"Token economies use conditioned reinforcers (tokens, points, stickers) that are later exchanged for backup reinforcers (preferred items/activities). Tokens acquire reinforcing value through pairing." },
  { id:"C-11-002", domain:"C", taskItem:"C-11", difficulty:"intermediate", question:"When implementing a token economy, the RBT should:", options:["A) Give tokens randomly throughout the day","B) Deliver tokens immediately contingent on the target behavior per the plan","C) Allow the client to take tokens whenever they want","D) Only use edible reinforcers as backup items"], correct:"B", explanation:"Tokens must be delivered immediately following the target behavior as specified in the behavior plan. Random delivery (A) weakens the contingency relationship between behavior and reinforcement." },
  { id:"C-12-001", domain:"C", taskItem:"C-12", difficulty:"intermediate", question:"Stimulus discrimination training teaches the learner to:", options:["A) Respond the same way to all stimuli","B) Respond differently in the presence of different stimuli","C) Ignore all environmental stimuli","D) Only respond to verbal instructions"], correct:"B", explanation:"Discrimination training teaches that responses are reinforced in the presence of certain stimuli (SD) but not others (S-delta). The learner differentiates between conditions." },

  // ============ D: BEHAVIOR REDUCTION ============
  { id:"D-01-001", domain:"D", taskItem:"D-01", difficulty:"basic", question:"The four functions of behavior are:", options:["A) Happy, sad, angry, scared","B) Attention, escape, access to tangibles, automatic/sensory","C) Positive, negative, neutral, mixed","D) Antecedent, behavior, consequence, setting event"], correct:"B", explanation:"The four functions: Social positive (attention), social negative (escape/avoidance), tangible (access to items/activities), and automatic (sensory/self-stimulation). All behavior serves at least one function." },
  { id:"D-01-002", domain:"D", taskItem:"D-01", difficulty:"intermediate", question:"A child screams every time math worksheets are presented and is then sent to the hallway. The likely function is:", options:["A) Attention","B) Access to tangibles","C) Escape/Avoidance","D) Automatic reinforcement"], correct:"C", explanation:"The behavior (screaming) results in removal of the demand (math worksheets). The consequence (leaving) negatively reinforces the behavior by allowing escape from the aversive task." },
  { id:"D-01-003", domain:"D", taskItem:"D-01", difficulty:"intermediate", question:"A child rocks back and forth when alone in a quiet room with no one around. The likely function is:", options:["A) Attention","B) Escape","C) Access to tangibles","D) Automatic/Sensory"], correct:"D", explanation:"The behavior occurs without social consequences (alone, no one present), suggesting it produces its own reinforcement through sensory stimulation. This is automatic reinforcement." },
  { id:"D-02-001", domain:"D", taskItem:"D-02", difficulty:"basic", question:"Differential reinforcement of alternative behavior (DRA) involves:", options:["A) Reinforcing the problem behavior","B) Reinforcing a specific desirable alternative behavior while withholding reinforcement for the problem behavior","C) Punishing all behaviors","D) Ignoring all behaviors"], correct:"B", explanation:"DRA strengthens an appropriate replacement behavior by reinforcing it while placing the problem behavior on extinction. The alternative should ideally serve the same function." },
  { id:"D-02-002", domain:"D", taskItem:"D-02", difficulty:"intermediate", question:"DRO (differential reinforcement of other behavior) involves:", options:["A) Reinforcing a specific replacement behavior","B) Reinforcing any behavior OTHER than the target problem behavior during a set interval","C) Only reinforcing the problem behavior","D) Reinforcing high rates of the target behavior"], correct:"B", explanation:"DRO delivers reinforcement when the target problem behavior has NOT occurred during a specified interval. Any other behavior is acceptable. It reinforces the absence of the problem behavior." },
  { id:"D-02-003", domain:"D", taskItem:"D-02", difficulty:"intermediate", question:"DRI (differential reinforcement of incompatible behavior) involves:", options:["A) Reinforcing a behavior that cannot occur simultaneously with the problem behavior","B) Reinforcing the problem behavior on a thinner schedule","C) Punishing the incompatible behavior","D) Ignoring all behavior"], correct:"A", explanation:"DRI reinforces a behavior physically incompatible with the problem behavior. Example: reinforcing hands in lap (incompatible with hitting) or sitting (incompatible with running)." },
  { id:"D-03-001", domain:"D", taskItem:"D-03", difficulty:"basic", question:"Antecedent interventions are designed to:", options:["A) Consequence behavior after it occurs","B) Prevent problem behavior by modifying the environment BEFORE it occurs","C) Punish the behavior","D) Only work with skill acquisition"], correct:"B", explanation:"Antecedent interventions are proactive strategies that modify the environment, instructions, or context before behavior occurs to reduce the likelihood of problem behavior (prevention vs. reaction)." },
  { id:"D-03-002", domain:"D", taskItem:"D-03", difficulty:"intermediate", question:"Which is an example of an antecedent modification?", options:["A) Giving a time-out after hitting","B) Providing a visual schedule before transitioning activities","C) Removing tokens after problem behavior","D) Blocking self-injurious behavior"], correct:"B", explanation:"A visual schedule is presented BEFORE the transition (antecedent) to reduce anxiety and problem behavior. Time-out (A) and token removal (C) are consequences. Blocking (D) is a reactive strategy." },
  { id:"D-04-001", domain:"D", taskItem:"D-04", difficulty:"intermediate", question:"Extinction in ABA involves:", options:["A) Punishing the behavior","B) Withholding the reinforcer that previously maintained the problem behavior","C) Removing the client from the environment","D) Providing continuous reinforcement"], correct:"B", explanation:"Extinction = discontinuing the reinforcement that was maintaining the behavior. If a behavior was maintained by attention, extinction means no longer providing attention when it occurs." },
  { id:"D-04-002", domain:"D", taskItem:"D-04", difficulty:"advanced", question:"An extinction burst is:", options:["A) When the behavior immediately stops","B) A temporary increase in frequency, intensity, or duration of the behavior when extinction is first implemented","C) When new behaviors appear permanently","D) A gradual decrease in behavior"], correct:"B", explanation:"When reinforcement is first withheld, the behavior often temporarily increases (gets worse before it gets better). This is a normal, expected part of extinction and signals the procedure is working." },
  { id:"D-05-001", domain:"D", taskItem:"D-05", difficulty:"basic", question:"An emergency procedure or crisis protocol should be used:", options:["A) As a first-line behavior reduction strategy","B) Only when there is imminent danger to the client or others","C) Whenever the client is non-compliant","D) To replace all other behavior interventions"], correct:"B", explanation:"Emergency/crisis protocols are last-resort procedures used only when there is imminent risk of serious harm. They should never be used as routine behavior management strategies." },

  // ============ E: DOCUMENTATION & REPORTING ============
  { id:"E-01-001", domain:"E", taskItem:"E-01", difficulty:"basic", question:"Session notes written by an RBT should include:", options:["A) The RBT's personal opinions about the client","B) Objective descriptions of what occurred during the session including data and observations","C) Diagnoses and clinical interpretations","D) Information about other clients"], correct:"B", explanation:"Session notes must be objective, factual, and include data collected, procedures implemented, and observable client responses. Subjective opinions (A) and diagnoses (C) are outside the RBT scope." },
  { id:"E-02-001", domain:"E", taskItem:"E-02", difficulty:"basic", question:"An RBT should communicate with the BCBA supervisor:", options:["A) Only when there is a crisis","B) Regularly, including reporting any concerns, changes, or notable observations","C) Only at the end of the month","D) Only if the client's family asks them to"], correct:"B", explanation:"Ongoing communication with the supervising BCBA is essential. RBTs should report changes in behavior, concerns about procedures, caregiver input, and any barriers to implementation promptly." },
  { id:"E-03-001", domain:"E", taskItem:"E-03", difficulty:"intermediate", question:"If a client exhibits a new behavior not addressed in the current behavior plan, the RBT should:", options:["A) Create their own intervention on the spot","B) Ignore it completely","C) Document the behavior and report it to the BCBA supervisor","D) Ask the client's parent what to do"], correct:"C", explanation:"RBTs document and report new or unexpected behaviors to the BCBA, who determines if the plan needs modification. Creating interventions independently (A) is outside the RBT's scope." },
  { id:"E-04-001", domain:"E", taskItem:"E-04", difficulty:"basic", question:"When writing about client behavior, the RBT should use:", options:["A) Emotional language like 'the client was being defiant'","B) Objective, behavioral terminology","C) Clinical jargon the family won't understand","D) Abbreviations without defining them"], correct:"B", explanation:"Documentation must use clear, objective behavioral language. Emotional interpretations (A) introduce bias. While technical terms are appropriate, they should be used correctly and consistently." },
  { id:"E-05-001", domain:"E", taskItem:"E-05", difficulty:"basic", question:"Client records and data should be:", options:["A) Shared freely on social media to show progress","B) Stored securely and only shared with authorized individuals per HIPAA and company policy","C) Left in the client's home for anyone to see","D) Discussed with other clients' families"], correct:"B", explanation:"HIPAA requires that all client information be kept confidential and stored securely. Only authorized individuals (treatment team, guardians with consent) may access client records." },

  // ============ F: PROFESSIONAL CONDUCT & SCOPE ============
  { id:"F-01-001", domain:"F", taskItem:"F-01", difficulty:"basic", question:"The RBT must practice under the close, ongoing supervision of:", options:["A) Any healthcare professional","B) A BCBA, BCaBA, or other qualified supervisor as defined by the BACB","C) The client's parent or guardian","D) Another RBT with more experience"], correct:"B", explanation:"RBTs must work under the supervision of a BCBA or BCaBA (or equivalent). They cannot practice independently. Another RBT (D) cannot supervise, and parents (C) are not qualified supervisors." },
  { id:"F-01-002", domain:"F", taskItem:"F-01", difficulty:"intermediate", question:"According to the BACB, RBT supervision must include:", options:["A) At least one face-to-face meeting per year","B) Ongoing supervision that includes direct observation of the RBT with clients","C) Only written feedback via email","D) Supervision only when problems arise"], correct:"B", explanation:"BACB requires ongoing supervision with direct observation of the RBT implementing services. Supervision must meet minimum frequency/percentage requirements and include real-time feedback." },
  { id:"F-02-001", domain:"F", taskItem:"F-02", difficulty:"basic", question:"If an RBT disagrees with a BCBA's recommendation for a client, the RBT should:", options:["A) Ignore the recommendation and do what they think is best","B) Discuss concerns with the BCBA respectfully and follow the plan unless directed otherwise","C) Complain to the client's family","D) Stop implementing the program entirely"], correct:"B", explanation:"RBTs should voice concerns to their supervisor through proper channels. However, they must continue implementing the plan as written until the BCBA makes changes. Going rogue (A) violates scope." },
  { id:"F-02-002", domain:"F", taskItem:"F-02", difficulty:"intermediate", question:"An RBT is asked by a parent to change a behavior plan procedure. The RBT should:", options:["A) Make the change since the parent requested it","B) Explain that changes must be approved by the BCBA and relay the request to the supervisor","C) Ignore the parent's concern","D) Tell the parent to call the BCBA directly and refuse to discuss it"], correct:"B", explanation:"Only the BCBA can modify behavior plans. The RBT should acknowledge the parent's concern, explain the process, and communicate the request to the supervisor promptly." },
  { id:"F-03-001", domain:"F", taskItem:"F-03", difficulty:"basic", question:"Maintaining client dignity means:", options:["A) Always agreeing with the client","B) Treating the client with respect, using age-appropriate language, and protecting their privacy","C) Avoiding any demands during sessions","D) Letting the client do whatever they want"], correct:"B", explanation:"Dignity involves respectful treatment, age-appropriate interactions, privacy protection, and providing choices when possible. It does not mean avoiding all demands (C) or being permissive (D)." },
  { id:"F-03-002", domain:"F", taskItem:"F-03", difficulty:"intermediate", question:"An RBT notices a coworker making fun of a client's behavior to another staff member. The RBT should:", options:["A) Join in the conversation","B) Ignore it since it doesn't involve them directly","C) Report it to their supervisor as it violates the client's dignity","D) Confront the coworker aggressively"], correct:"C", explanation:"RBTs have an ethical obligation to protect client dignity. Mocking a client's behavior is a serious violation that should be reported to a supervisor through proper channels." },
  { id:"F-04-001", domain:"F", taskItem:"F-04", difficulty:"basic", question:"An RBT should maintain professional boundaries by:", options:["A) Becoming close personal friends with the client's family","B) Keeping the relationship professional, avoiding dual relationships, and following company policies","C) Sharing personal problems with the client's caregivers","D) Accepting expensive gifts from families"], correct:"B", explanation:"Professional boundaries protect the client and the therapeutic relationship. Dual relationships, excessive personal sharing, and accepting gifts can compromise objectivity and create conflicts." },
  { id:"F-04-002", domain:"F", taskItem:"F-04", difficulty:"intermediate", question:"A client's parent offers to pay the RBT directly for extra sessions outside of the agency. The RBT should:", options:["A) Accept since it helps the client","B) Decline and explain this would be outside their professional scope and agency policy","C) Accept but don't tell the agency","D) Set up a separate contract"], correct:"B", explanation:"Accepting private payment creates a dual relationship and likely violates agency policy and ethical guidelines. All services should be coordinated through proper professional channels." },
  { id:"F-05-001", domain:"F", taskItem:"F-05", difficulty:"basic", question:"Cultural responsiveness in ABA means:", options:["A) Ignoring cultural differences to treat everyone the same","B) Considering the client's cultural background when implementing treatment","C) Only working with clients from your own culture","D) Imposing your own cultural values on the client"], correct:"B", explanation:"Cultural responsiveness means being aware of and respecting the client's cultural background, values, and practices. Treatment should be adapted to be culturally appropriate while maintaining effectiveness." },
  { id:"F-06-001", domain:"F", taskItem:"F-06", difficulty:"basic", question:"If an RBT suspects a client is being abused or neglected, they should:", options:["A) Ignore it unless they witness it directly","B) Report it to the appropriate authorities as a mandated reporter","C) Confront the suspected abuser","D) Wait and see if it happens again"], correct:"B", explanation:"RBTs are mandated reporters. If abuse or neglect is suspected, it MUST be reported to the appropriate authorities (e.g., child protective services). You do not need to witness it directly or wait." },
];

// ─── DOMAIN METADATA ───
const DOMAINS = {
  A: { name: "Measurement", color: "#e07a5f", icon: "◉" },
  B: { name: "Assessment", color: "#3d85c6", icon: "◎" },
  C: { name: "Skill Acquisition", color: "#81b29a", icon: "◈" },
  D: { name: "Behavior Reduction", color: "#f2cc8f", icon: "◆" },
  E: { name: "Documentation", color: "#9b8ec4", icon: "◇" },
  F: { name: "Professional Conduct", color: "#e8836b", icon: "◐" },
};

// ─── SHUFFLE UTILITY ───
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── MAIN APP ───
export default function RBTExamPrep() {
  const [mode, setMode] = useState("menu"); // menu | quiz | flashcard | review
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [quizSize, setQuizSize] = useState(20);
  const [streakCount, setStreakCount] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const filtered = useMemo(() => {
    return QUESTIONS.filter(q => {
      if (filterDomain !== "all" && q.domain !== filterDomain) return false;
      if (filterDifficulty !== "all" && q.difficulty !== filterDifficulty) return false;
      return true;
    });
  }, [filterDomain, filterDifficulty]);

  const startQuiz = useCallback(() => {
    const pool = shuffle(filtered).slice(0, quizSize);
    setQuizQuestions(pool);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setStreakCount(0);
    setMode("quiz");
  }, [filtered, quizSize]);

  const startFlashcards = useCallback(() => {
    setQuizQuestions(shuffle(filtered));
    setCurrentIdx(0);
    setFlashcardFlipped(false);
    setMode("flashcard");
  }, [filtered]);

  const handleAnswer = useCallback((letter) => {
    if (showResult) return;
    setSelectedAnswer(letter);
    setShowResult(true);
    const q = quizQuestions[currentIdx];
    const isCorrect = letter === q.correct;
    setAnswers(prev => [...prev, { ...q, chosen: letter, isCorrect }]);
    if (isCorrect) {
      const ns = streakCount + 1;
      setStreakCount(ns);
      if (ns > bestStreak) setBestStreak(ns);
    } else {
      setStreakCount(0);
    }
  }, [showResult, quizQuestions, currentIdx, streakCount, bestStreak]);

  const nextQuestion = useCallback(() => {
    if (currentIdx + 1 >= quizQuestions.length) {
      setMode("review");
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentIdx, quizQuestions]);

  const nextFlashcard = useCallback(() => {
    setFlashcardFlipped(false);
    setCurrentIdx(prev => (prev + 1) % quizQuestions.length);
  }, [quizQuestions]);

  const prevFlashcard = useCallback(() => {
    setFlashcardFlipped(false);
    setCurrentIdx(prev => (prev - 1 + quizQuestions.length) % quizQuestions.length);
  }, [quizQuestions]);

  const score = answers.filter(a => a.isCorrect).length;
  const total = answers.length;
  const currentQ = quizQuestions[currentIdx];

  // ─── RENDER ───
  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoArea}>
            <span style={styles.logoMark}>RBT</span>
            <span style={styles.logoText}>Exam Prep</span>
          </div>
          {mode !== "menu" && (
            <button onClick={() => setMode("menu")} style={styles.backBtn}>
              ← Menu
            </button>
          )}
        </div>
      </header>

      <main style={styles.main}>
        {/* ─── MENU ─── */}
        {mode === "menu" && (
          <div style={styles.menuWrap}>
            <div style={styles.heroCard}>
              <h1 style={styles.heroTitle}>Master the RBT Exam</h1>
              <p style={styles.heroSub}>{QUESTIONS.length} questions across {Object.keys(DOMAINS).length} BACB domains</p>
            </div>

            {/* Filters */}
            <div style={styles.filterSection}>
              <div style={styles.filterRow}>
                <label style={styles.filterLabel}>Domain</label>
                <div style={styles.chipRow}>
                  <Chip active={filterDomain === "all"} onClick={() => setFilterDomain("all")}>All</Chip>
                  {Object.entries(DOMAINS).map(([k, v]) => (
                    <Chip key={k} active={filterDomain === k} color={v.color} onClick={() => setFilterDomain(k)}>
                      {v.icon} {k}
                    </Chip>
                  ))}
                </div>
              </div>
              <div style={styles.filterRow}>
                <label style={styles.filterLabel}>Difficulty</label>
                <div style={styles.chipRow}>
                  {["all","basic","intermediate","advanced"].map(d => (
                    <Chip key={d} active={filterDifficulty === d} onClick={() => setFilterDifficulty(d)}>
                      {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
                    </Chip>
                  ))}
                </div>
              </div>
              <p style={styles.filterCount}>{filtered.length} questions available</p>
            </div>

            {/* Quiz size */}
            <div style={styles.sizeRow}>
              <label style={styles.filterLabel}>Quiz Length</label>
              <div style={styles.chipRow}>
                {[10, 20, 30, 50].map(n => (
                  <Chip key={n} active={quizSize === n} onClick={() => setQuizSize(n)}>{n}</Chip>
                ))}
                <Chip active={quizSize === filtered.length} onClick={() => setQuizSize(filtered.length)}>All ({filtered.length})</Chip>
              </div>
            </div>

            {/* Action buttons */}
            <div style={styles.actionRow}>
              <button style={styles.primaryBtn} onClick={startQuiz} disabled={filtered.length === 0}>
                Start Quiz
              </button>
              <button style={styles.secondaryBtn} onClick={startFlashcards} disabled={filtered.length === 0}>
                Flashcards
              </button>
            </div>

            {/* Domain breakdown */}
            <div style={styles.domainGrid}>
              {Object.entries(DOMAINS).map(([k, v]) => {
                const count = QUESTIONS.filter(q => q.domain === k).length;
                return (
                  <div key={k} style={{...styles.domainCard, borderLeft: `4px solid ${v.color}`}}>
                    <div style={{...styles.domainIcon, color: v.color}}>{v.icon}</div>
                    <div>
                      <div style={styles.domainName}>{v.name}</div>
                      <div style={styles.domainCount}>{count} questions</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── QUIZ ─── */}
        {mode === "quiz" && currentQ && (
          <div style={styles.quizWrap}>
            {/* Progress bar */}
            <div style={styles.progressOuter}>
              <div style={{...styles.progressInner, width: `${((currentIdx + 1) / quizQuestions.length) * 100}%`}} />
            </div>
            <div style={styles.quizMeta}>
              <span style={styles.qCounter}>{currentIdx + 1} / {quizQuestions.length}</span>
              <span style={{...styles.domainBadge, background: DOMAINS[currentQ.domain].color}}>
                {DOMAINS[currentQ.domain].icon} {currentQ.domain}: {DOMAINS[currentQ.domain].name}
              </span>
              <span style={styles.diffBadge}>{currentQ.difficulty}</span>
              {streakCount > 1 && <span style={styles.streakBadge}>🔥 {streakCount}</span>}
            </div>

            {/* Score ticker */}
            <div style={styles.scoreTicker}>
              {score}/{total} correct {total > 0 && <span style={styles.pctInline}>({Math.round((score / total) * 100)}%)</span>}
            </div>

            {/* Question card */}
            <div style={styles.questionCard}>
              <p style={styles.questionText}>{currentQ.question}</p>
              <div style={styles.optionsList}>
                {currentQ.options.map((opt) => {
                  const letter = opt.charAt(0);
                  let optStyle = { ...styles.optionBtn };
                  if (showResult) {
                    if (letter === currentQ.correct) {
                      optStyle = { ...optStyle, ...styles.optionCorrect };
                    } else if (letter === selectedAnswer && !answers[answers.length - 1]?.isCorrect) {
                      optStyle = { ...optStyle, ...styles.optionWrong };
                    } else {
                      optStyle = { ...optStyle, opacity: 0.45 };
                    }
                  } else if (selectedAnswer === letter) {
                    optStyle = { ...optStyle, ...styles.optionSelected };
                  }
                  return (
                    <button
                      key={letter}
                      style={optStyle}
                      onClick={() => handleAnswer(letter)}
                      disabled={showResult}
                    >
                      <span style={styles.optLetter}>{letter}</span>
                      <span style={styles.optText}>{opt.substring(3)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Instant feedback */}
              {showResult && (
                <div style={answers[answers.length - 1]?.isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}>
                  <div style={styles.feedbackHeader}>
                    <span style={styles.feedbackIcon}>
                      {answers[answers.length - 1]?.isCorrect ? "✓" : "✗"}
                    </span>
                    <span style={styles.feedbackTitle}>
                      {answers[answers.length - 1]?.isCorrect ? "Correct!" : `Incorrect — Answer: ${currentQ.correct}`}
                    </span>
                  </div>
                  <p style={styles.feedbackExplanation}>{currentQ.explanation}</p>
                  <button style={styles.nextBtn} onClick={nextQuestion}>
                    {currentIdx + 1 >= quizQuestions.length ? "View Results" : "Next Question →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── FLASHCARDS ─── */}
        {mode === "flashcard" && currentQ && (
          <div style={styles.flashWrap}>
            <div style={styles.quizMeta}>
              <span style={styles.qCounter}>{currentIdx + 1} / {quizQuestions.length}</span>
              <span style={{...styles.domainBadge, background: DOMAINS[currentQ.domain].color}}>
                {DOMAINS[currentQ.domain].icon} {currentQ.domain}
              </span>
            </div>
            <div
              style={styles.flashCard}
              onClick={() => setFlashcardFlipped(!flashcardFlipped)}
            >
              {!flashcardFlipped ? (
                <div>
                  <p style={styles.flashQuestion}>{currentQ.question}</p>
                  <p style={styles.flashHint}>tap to reveal</p>
                </div>
              ) : (
                <div>
                  <div style={styles.flashAnswer}>
                    <span style={styles.flashCorrectLetter}>{currentQ.correct}</span>
                    {currentQ.options.find(o => o.startsWith(currentQ.correct))?.substring(3)}
                  </div>
                  <p style={styles.flashExplanation}>{currentQ.explanation}</p>
                </div>
              )}
            </div>
            <div style={styles.flashNav}>
              <button style={styles.flashNavBtn} onClick={prevFlashcard}>← Prev</button>
              <button style={styles.flashNavBtn} onClick={nextFlashcard}>Next →</button>
            </div>
          </div>
        )}

        {/* ─── REVIEW ─── */}
        {mode === "review" && (
          <div style={styles.reviewWrap}>
            <div style={styles.reviewHeader}>
              <h2 style={styles.reviewTitle}>Quiz Complete</h2>
              <div style={styles.reviewScoreCircle}>
                <span style={styles.reviewScoreNum}>{Math.round((score / quizQuestions.length) * 100)}%</span>
                <span style={styles.reviewScoreSub}>{score} / {quizQuestions.length}</span>
              </div>
              {bestStreak > 1 && <p style={styles.streakFinal}>Best streak: 🔥 {bestStreak}</p>}
              {score / quizQuestions.length >= 0.8 ? (
                <p style={styles.reviewMsg}>Strong performance! Keep reinforcing weak areas.</p>
              ) : score / quizQuestions.length >= 0.6 ? (
                <p style={styles.reviewMsg}>Good effort — review the items below to strengthen your knowledge.</p>
              ) : (
                <p style={styles.reviewMsg}>Keep studying! Focus on the explanations below for each missed item.</p>
              )}
            </div>

            {/* Domain breakdown */}
            <div style={styles.reviewDomainBreak}>
              {Object.entries(DOMAINS).map(([k, v]) => {
                const domainAnswers = answers.filter(a => a.domain === k);
                if (domainAnswers.length === 0) return null;
                const domainCorrect = domainAnswers.filter(a => a.isCorrect).length;
                const pct = Math.round((domainCorrect / domainAnswers.length) * 100);
                return (
                  <div key={k} style={styles.reviewDomainRow}>
                    <span style={{...styles.reviewDomainLabel, color: v.color}}>{v.icon} {v.name}</span>
                    <div style={styles.reviewBarOuter}>
                      <div style={{...styles.reviewBarInner, width: `${pct}%`, background: v.color}} />
                    </div>
                    <span style={styles.reviewDomainPct}>{domainCorrect}/{domainAnswers.length}</span>
                  </div>
                );
              })}
            </div>

            {/* Missed questions detail */}
            {answers.filter(a => !a.isCorrect).length > 0 && (
              <div style={styles.missedSection}>
                <h3 style={styles.missedTitle}>Missed Questions</h3>
                {answers.filter(a => !a.isCorrect).map((a, i) => (
                  <div key={i} style={styles.missedCard}>
                    <div style={styles.missedQ}>{a.question}</div>
                    <div style={styles.missedYours}>
                      Your answer: <span style={styles.missedWrongText}>{a.chosen}) {a.options.find(o => o.startsWith(a.chosen))?.substring(3)}</span>
                    </div>
                    <div style={styles.missedCorrectRow}>
                      Correct: <span style={styles.missedCorrectText}>{a.correct}) {a.options.find(o => o.startsWith(a.correct))?.substring(3)}</span>
                    </div>
                    <p style={styles.missedExplanation}>{a.explanation}</p>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.reviewActions}>
              <button style={styles.primaryBtn} onClick={startQuiz}>Retry Quiz</button>
              <button style={styles.secondaryBtn} onClick={() => setMode("menu")}>Back to Menu</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── CHIP COMPONENT ───
function Chip({ children, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...chipStyles.base,
        ...(active ? { ...chipStyles.active, background: color || "#1a1a2e", borderColor: color || "#1a1a2e" } : {}),
      }}
    >
      {children}
    </button>
  );
}

const chipStyles = {
  base: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1.5px solid #ccc",
    background: "transparent",
    color: "#555",
    fontSize: "13px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all .15s",
    whiteSpace: "nowrap",
  },
  active: {
    color: "#fff",
    borderColor: "#1a1a2e",
    background: "#1a1a2e",
  },
};

// ─── STYLES ───
const styles = {
  app: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#f5f0eb",
    minHeight: "100vh",
    color: "#1a1a2e",
  },
  header: {
    background: "#1a1a2e",
    borderBottom: "3px solid #e07a5f",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoArea: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: {
    background: "#e07a5f",
    color: "#fff",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize: 14,
    padding: "4px 10px",
    borderRadius: 6,
    letterSpacing: 1,
  },
  logoText: { color: "#f5f0eb", fontSize: 17, fontWeight: 500, letterSpacing: 0.3 },
  backBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#f5f0eb",
    padding: "6px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
  },
  main: { maxWidth: 760, margin: "0 auto", padding: "24px 16px 60px" },

  // MENU
  menuWrap: { display: "flex", flexDirection: "column", gap: 24 },
  heroCard: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%)",
    color: "#f5f0eb",
    borderRadius: 16,
    padding: "36px 28px",
    textAlign: "center",
  },
  heroTitle: { fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: -0.5 },
  heroSub: { margin: "10px 0 0", opacity: 0.75, fontSize: 15 },
  filterSection: { display: "flex", flexDirection: "column", gap: 14 },
  filterRow: { display: "flex", flexDirection: "column", gap: 6 },
  filterLabel: { fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#888" },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  filterCount: { fontSize: 13, color: "#999", marginTop: -4 },
  sizeRow: { display: "flex", flexDirection: "column", gap: 6 },
  actionRow: { display: "flex", gap: 12 },
  primaryBtn: {
    flex: 1,
    padding: "14px 24px",
    background: "#1a1a2e",
    color: "#f5f0eb",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "transform .1s",
  },
  secondaryBtn: {
    flex: 1,
    padding: "14px 24px",
    background: "transparent",
    color: "#1a1a2e",
    border: "2px solid #1a1a2e",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  domainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 12,
  },
  domainCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#fff",
    borderRadius: 10,
    padding: "14px 16px",
  },
  domainIcon: { fontSize: 22 },
  domainName: { fontSize: 14, fontWeight: 600 },
  domainCount: { fontSize: 12, color: "#888" },

  // QUIZ
  quizWrap: { display: "flex", flexDirection: "column", gap: 16 },
  progressOuter: { background: "#ddd", borderRadius: 6, height: 6, overflow: "hidden" },
  progressInner: { background: "#e07a5f", height: "100%", borderRadius: 6, transition: "width .3s" },
  quizMeta: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  qCounter: { fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#888" },
  domainBadge: {
    color: "#fff",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 12,
    letterSpacing: 0.3,
  },
  diffBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 12,
    background: "#eee",
    color: "#666",
    textTransform: "capitalize",
  },
  streakBadge: {
    fontSize: 12,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 12,
    background: "#fff3e0",
    color: "#e65100",
  },
  scoreTicker: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    color: "#666",
  },
  pctInline: { color: "#999" },
  questionCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "28px 24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  questionText: { fontSize: 17, fontWeight: 500, lineHeight: 1.55, margin: "0 0 20px" },
  optionsList: { display: "flex", flexDirection: "column", gap: 10 },
  optionBtn: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "14px 16px",
    border: "2px solid #e0dbd5",
    borderRadius: 12,
    background: "#fafaf7",
    cursor: "pointer",
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    textAlign: "left",
    transition: "all .12s",
    lineHeight: 1.45,
  },
  optionSelected: { borderColor: "#1a1a2e", background: "#f0eef5" },
  optionCorrect: {
    borderColor: "#2e7d32",
    background: "#e8f5e9",
    boxShadow: "0 0 0 1px #2e7d32",
  },
  optionWrong: {
    borderColor: "#c62828",
    background: "#ffebee",
    boxShadow: "0 0 0 1px #c62828",
  },
  optLetter: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    fontSize: 14,
    color: "#888",
    minWidth: 18,
    paddingTop: 1,
  },
  optText: { flex: 1 },

  // INSTANT FEEDBACK
  feedbackCorrect: {
    marginTop: 20,
    padding: "18px 20px",
    borderRadius: 12,
    background: "#e8f5e9",
    border: "1.5px solid #66bb6a",
  },
  feedbackWrong: {
    marginTop: 20,
    padding: "18px 20px",
    borderRadius: 12,
    background: "#fff3e0",
    border: "1.5px solid #ffa726",
  },
  feedbackHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  feedbackIcon: {
    fontSize: 20,
    fontWeight: 800,
    fontFamily: "'JetBrains Mono', monospace",
  },
  feedbackTitle: { fontSize: 15, fontWeight: 700 },
  feedbackExplanation: { fontSize: 14, lineHeight: 1.6, color: "#333", margin: "4px 0 16px" },
  nextBtn: {
    padding: "10px 24px",
    background: "#1a1a2e",
    color: "#f5f0eb",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },

  // FLASHCARDS
  flashWrap: { display: "flex", flexDirection: "column", gap: 16, alignItems: "center" },
  flashCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "40px 28px",
    minHeight: 280,
    width: "100%",
    maxWidth: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "box-shadow .2s",
  },
  flashQuestion: { fontSize: 18, fontWeight: 500, lineHeight: 1.6, margin: 0 },
  flashHint: { fontSize: 12, color: "#aaa", marginTop: 20 },
  flashAnswer: { fontSize: 17, fontWeight: 600, lineHeight: 1.5, marginBottom: 16 },
  flashCorrectLetter: {
    display: "inline-block",
    background: "#e07a5f",
    color: "#fff",
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    width: 28,
    height: 28,
    lineHeight: "28px",
    borderRadius: 8,
    textAlign: "center",
    marginRight: 10,
    fontSize: 14,
  },
  flashExplanation: { fontSize: 14, color: "#555", lineHeight: 1.6, marginTop: 8 },
  flashNav: { display: "flex", gap: 12 },
  flashNavBtn: {
    padding: "10px 28px",
    background: "#1a1a2e",
    color: "#f5f0eb",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },

  // REVIEW
  reviewWrap: { display: "flex", flexDirection: "column", gap: 24 },
  reviewHeader: { textAlign: "center" },
  reviewTitle: { fontSize: 24, fontWeight: 700, margin: "0 0 16px" },
  reviewScoreCircle: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
    borderRadius: "50%",
    background: "#1a1a2e",
    color: "#f5f0eb",
    margin: "0 auto 12px",
  },
  reviewScoreNum: { fontSize: 32, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" },
  reviewScoreSub: { fontSize: 13, opacity: 0.7 },
  streakFinal: { fontSize: 14, color: "#e65100", fontWeight: 600 },
  reviewMsg: { fontSize: 15, color: "#555", maxWidth: 400, margin: "0 auto" },
  reviewDomainBreak: { display: "flex", flexDirection: "column", gap: 10 },
  reviewDomainRow: { display: "flex", alignItems: "center", gap: 12 },
  reviewDomainLabel: { fontSize: 13, fontWeight: 600, minWidth: 140 },
  reviewBarOuter: { flex: 1, background: "#e0dbd5", borderRadius: 6, height: 10, overflow: "hidden" },
  reviewBarInner: { height: "100%", borderRadius: 6, transition: "width .4s" },
  reviewDomainPct: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#888", minWidth: 40 },
  missedSection: { display: "flex", flexDirection: "column", gap: 14 },
  missedTitle: { fontSize: 18, fontWeight: 700, margin: 0, borderBottom: "2px solid #e07a5f", paddingBottom: 8, display: "inline-block" },
  missedCard: {
    background: "#fff",
    borderRadius: 12,
    padding: "18px 20px",
    borderLeft: "4px solid #c62828",
  },
  missedQ: { fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.45 },
  missedYours: { fontSize: 13, color: "#888", marginBottom: 4 },
  missedWrongText: { color: "#c62828", fontWeight: 600 },
  missedCorrectRow: { fontSize: 13, color: "#888", marginBottom: 8 },
  missedCorrectText: { color: "#2e7d32", fontWeight: 600 },
  missedExplanation: { fontSize: 13, color: "#555", lineHeight: 1.55, margin: 0, background: "#f9f9f6", padding: "10px 14px", borderRadius: 8 },
  reviewActions: { display: "flex", gap: 12 },
};
