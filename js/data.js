/* =====================================================================
   OFFICELIFE DATA  (everything here is hardcoded, so the app works with no AI)
   ===================================================================== */

const UNIS = [
  "Wale University",
  "Ahmadu Bello University","Bayero University Kano","University of Lagos","University of Ibadan","Obafemi Awolowo University",
  "University of Nigeria, Nsukka","University of Benin","University of Ilorin","University of Port Harcourt","University of Jos",
  "University of Calabar","University of Uyo","University of Abuja","University of Maiduguri","Usmanu Danfodiyo University",
  "Federal University of Technology, Akure","Federal University of Technology, Minna","Federal University of Technology, Owerri",
  "Federal University of Agriculture, Abeokuta","Michael Okpara University of Agriculture, Umudike","Nnamdi Azikiwe University",
  "Federal University, Oye-Ekiti","Federal University, Lokoja","Federal University, Dutse","Federal University, Lafia",
  "Federal University, Wukari","Federal University, Otuoke","Federal University, Birnin Kebbi","Federal University, Gusau",
  "Federal University of Petroleum Resources, Effurun","Nigerian Defence Academy","National Open University of Nigeria",
  "Lagos State University","Lagos State University of Science and Technology","Ladoke Akintola University of Technology",
  "Olabisi Onabanjo University","Ekiti State University","Adekunle Ajasin University","Osun State University",
  "Delta State University","Rivers State University","Imo State University","Abia State University",
  "Enugu State University of Science and Technology","Ebonyi State University","Kogi State University","Benue State University",
  "Kwara State University","Nasarawa State University","Niger Delta University","Ambrose Alli University",
  "Tai Solarin University of Education","Kaduna State University","Abubakar Tafawa Balewa University","Gombe State University",
  "Umaru Musa Yar'adua University","Akwa Ibom State University","Chukwuemeka Odumegwu Ojukwu University",
  "Covenant University","Babcock University","Bowen University","Landmark University","Afe Babalola University",
  "Redeemer's University","Pan-Atlantic University","Lead City University","Ajayi Crowther University","American University of Nigeria",
  "Nile University of Nigeria","Baze University","Bells University of Technology","Crawford University","Crescent University",
  "Caleb University","Elizade University","Fountain University","Godfrey Okoye University","Igbinedion University",
  "Joseph Ayo Babalola University","McPherson University","Mountain Top University","Oduduwa University","Paul University",
  "Rhema University","Salem University","Summit University","Wesley University","Achievers University","Adeleke University",
  "Al-Hikmah University","Anchor University","Augustine University","Benson Idahosa University","Bingham University",
  "Dominion University","Edwin Clark University","Hallmark University","Kings University",
  "A polytechnic or college","Other Nigerian university","Not a student (graduate or job seeker)"
];

const LEVELS = ["100 level","200 level","300 level","400 level","500 level","Graduate (NYSC or waiting)","Graduated"];
const PEOPLE = {
  chidi:{name:"Chidi Eze",role:"Head of Product",color:"#5B2BC4",ini:"CE"},
  tunde:{name:"Tunde Alabi",role:"Engineering Lead",color:"#0B6E5B",ini:"TA"},
  amina:{name:"Amina Bello",role:"Product Designer",color:"#B4326E",ini:"AB"},
  bisi:{name:"Bisi Okon",role:"QA Engineer",color:"#A65A00",ini:"BO"},
  ngozi:{name:"Ngozi Obi",role:"Head of Data",color:"#0A5FA8",ini:"NO"},
  femi:{name:"Femi Adeyemi",role:"Operations Manager",color:"#8A3B12",ini:"FA"},
  zainab:{name:"Zainab Yusuf",role:"HR Director",color:"#D93900",ini:"ZY"} // <-- ADDED
};

const DAY_PLAN = [
  ["9:00 AM","Clock in","Your arrival is logged as early, on time or late."],
  ["9:30 AM","Team standup","Messages from your manager and teammates arrive in chat."],
  ["10:00 AM","Main task","Do the work, upload a file or type your answer, and get reviewed."],
  ["11:00 AM","Manager follow-up","You explain your thinking in your own words."],
  ["11:30 AM","Urgent decision","Two things need you at once. Pick one before the clock runs out."],
  ["2:30 PM","Afternoon check-in","A short pop-up question tests your thinking."],
  ["5:00 PM","Clock out","Your day report is saved to your certificate."]
];

/* ---------- ROLES ---------- */
const ROLES = {
/* ============================ PROJECT MANAGER ============================ */
/* ============================ PROJECT MANAGER ============================ */
pm:{
  id:"pm", title:"Project Manager", short:"PM", manager:"chidi", cls:"",
  blurb:"Run the launch of a delivery app for a Lagos logistics startup.",
  learn:["Plan a project with clear milestones, owners and risks","Prioritise when two urgent things collide","Communicate with developers, designers and clients","Make a launch decision and defend it"],
  skills:["Project planning","Prioritisation","Risk management","Stakeholder communication","Decision-making","Time management"],
  jobs:"Project Coordinator, Product Associate, Operations Analyst",
  days:[
  {theme:"Get the plan straight",steps:[
    {t:"09:05",type:"msg",from:"chidi",text:"Good morning, and welcome to Tembea Logistics. We ship Driver App 2.0 in two weeks and I need you running the project. Standup is at 9:30."},
    {t:"09:30",type:"msg",from:"tunde",text:"Standup update: login and maps are done. The payments screen is 3 days behind because the bank API keeps timing out."},
    {t:"09:35",type:"msg",from:"amina",text:"Designs for the delivery summary are ready. I need feedback before noon or I cannot hand over to Tunde today."},
    {t:"09:45",type:"reply",from:"chidi",text:"Quick one. What is your read on the payments delay?",options:[
      {label:"Ask Tunde for a revised date and what exactly is blocking him",score:100,resp:"Good. Facts first, then we decide."},
      {label:"Tell the team to work faster",score:30,resp:"That will not unblock a bank API. Ask what is blocking him."},
      {label:"Say nothing for now",score:50,resp:"Silence hides risk. Raise it early next time."}]},
    {t:"10:00",type:"task",title:"Write a one-page project plan",
      brief:"Create a one-page plan for Driver App 2.0 with the goal, key milestones with dates, owners and the top 2 risks. Upload a file or type your plan.",
      due:"11:15 AM",minWords:40,
      rubric:[
        {label:"Clarity of Goal",keywords:["goal","objective","launch","aim","measurable"],fix:"State a single, measurable launch objective."},
        {label:"Dependencies mapped",keywords:["milestone","sequence","before","after","dependency","handover"],fix:"Sequence milestones logically (e.g., API integration before payment testing)."},
        {label:"Actionable Risk Response",keywords:["mitigat","backup","contingency","owner","action"],fix:"Give each risk a specific mitigation action and a single accountable owner."},
        {label:"Buffer",keywords:["buffer","extra time","slip","risk","contingency"],fix:"Acknowledge the bank API timeout risk and allocate a buffer."}],
      sampleName:"driver-app-plan.pdf",
      sampleBad:"Driver App 2.0 plan. Goal: launch the app in two weeks. Milestones: design handoff, payments screen, testing, launch. The team will work hard to finish everything on time and keep the client happy.",
      sampleGood:"Driver App 2.0 plan. Goal: launch the app in 2 weeks. Milestones: Design handoff Wed, Payments screen Fri (with 2-day buffer for API issues), Testing Tues, Launch Thurs. Owners: Amina, Tunde, Bisi. Risks: Bank API timeouts (Tunde to build fallback); Design delays (Amina to review daily)."},
    {t:"11:05",type:"followup",from:"chidi",q:"I saw your plan. In one or two sentences, why did you set the milestone dates the way you did?",
      keywords:["because","depends","dependency","buffer","payments","api","testing","time","risk","critical"],minWords:8,
      good:"That shows real thinking. Dates need a reason, not just a guess.",weak:"Try to link each date to a dependency, such as payments before testing."},
    {t:"11:30",type:"decision",q:"Two urgent things, one hour",
      a:{title:"Join the unhappy client call",detail:"Zenith Stores says 40 parcels arrived late. The call starts at 12:00.",score:100,fb:"Right call. The client call cannot move, and you can ask the CEO for 30 more minutes on the report."},
      b:{title:"Finish the weekly CEO report",detail:"It is due at 12:30. The CEO reads it before the board meeting.",score:60,fb:"Understandable, but a client escalation cannot wait. A quick message to the CEO would have bought you time."}},
    {t:"13:00",type:"break"},
    {t:"14:30",type:"quiz",q:"Tunde says payments will take 3 more days. Launch is in 10 days. What do you do first?",
      options:["Move the launch date by 3 days","Check which tasks can run in parallel and find the new critical path","Ask Amina to cut design work","Tell the CEO everything is fine"],correct:1,
      why:"Understand the critical path before moving dates or scope. The delay may not affect launch at all."}
  ]},
  {theme:"Manage risk and people",steps:[
    {t:"09:00",type:"msg",from:"chidi",text:"Day two. Tunde found a workaround for the payments API, but it needs one small design change from Amina."},
    {t:"09:20",type:"reply",from:"amina",text:"If changes keep coming this late I cannot hit my deadlines. This is the third one this week.",options:[
      {label:"Acknowledge it and agree a simple change-request process",score:100,resp:"Thanks, that helps. A process means fewer surprises."},
      {label:"Tell her to just make the change",score:30,resp:"Okay, I will do it, but this is not sustainable."},
      {label:"Agree with her and blame the developers",score:50,resp:"Fair, but that will not get the change done today."}]},
    {t:"10:00",type:"task",title:"Build a risk register",
      brief:"List the top 5 risks for Driver App 2.0. For each one add likelihood, impact, an owner and your response. Upload a file or type it.",
      due:"11:15 AM",minWords:50,
      rubric:[
        {label:"Likelihood and impact",keywords:["likelihood","impact","high","medium","low","probab"],fix:"Rate each risk by likelihood and impact (high, medium, low)."},
        {label:"Owners",keywords:["owner","responsible","assigned","tunde","amina","bisi","chidi"],fix:"Give every risk an owner."},
        {label:"Response plan",keywords:["mitigat","backup","plan b","response","reduce","prevent","contingency"],fix:"Add a response for each risk, such as a backup plan."},
        {label:"Specific risks",keywords:["api","payment","delay","budget","scope","bug","client","testing"],fix:"Name real project risks, such as the payments API, scope changes or testing time."}],
      sampleName:"risk-register.pdf",
      sampleBad:"Risk register for Driver App 2.0. Risk 1: payments API delay. Risk 2: the client may change the scope. Risk 3: testing may take longer. Risk 4: a developer falls sick. Risk 5: the budget may not be enough for the extra work.",
      sampleGood:"Risk register. 1) Payments API delay: likelihood high, impact high, owner Tunde, response build a backup flow. 2) Scope change from client: likelihood medium, impact high, owner me, response a change-request process. 3) Testing runs late: likelihood medium, impact medium, owner Bisi, response start testing early."},
    {t:"11:05",type:"followup",from:"chidi",q:"Which of your five risks worries you most, and why?",keywords:["because","payment","api","impact","launch","delay","most","client","scope"],minWords:8,
      good:"Good. Naming one top risk and a reason is what leaders need.",weak:"Pick one risk and say what happens if it goes wrong."},
    {t:"11:30",type:"decision",q:"The client wants a new feature",
      a:{title:"Say yes to live parcel photos",detail:"Zenith Stores asks for it before launch. It adds about 5 days.",score:40,fb:"Saying yes without checking impact puts the launch at risk. Always show the trade-off first."},
      b:{title:"Explain the impact and offer it for version 2.1",detail:"Ship on time, and schedule the feature right after launch.",score:100,fb:"Good judgement. You protected the deadline and kept the client in the plan."}},
    {t:"13:00",type:"break"},
    {t:"14:30",type:"quiz",q:"Which tool shows who is Responsible, Accountable, Consulted and Informed for each task?",
      options:["Gantt chart","RACI matrix","Burndown chart","SWOT analysis"],correct:1,why:"A RACI matrix makes roles clear so nothing falls between people."}
  ]},
  {theme:"Launch decision",steps:[
    {t:"09:00",type:"msg",from:"chidi",text:"Launch is tomorrow. QA found one minor bug: the driver profile photo only refreshes after a restart."},
    {t:"09:25",type:"reply",from:"chidi",text:"The CEO wants an update in the next hour. How do you write it?",options:[
      {label:"Short and honest: status, the known bug, your plan and what you need",score:100,resp:"Exactly what a CEO needs. Send it."},
      {label:"Say all is green and mention the bug later",score:20,resp:"That would damage trust the moment someone finds it."},
      {label:"Send a long technical report",score:55,resp:"Too much detail. Lead with the decision."}]},
    {t:"10:00",type:"task",title:"Write the go / no-go message",
      brief:"Write a short message to the CEO recommending go or no-go for launch. Include the known bug, the risk and your plan. Upload a file or type it.",
      due:"11:15 AM",minWords:45,
      rubric:[
        {label:"Clear recommendation",keywords:["recommend","go ","launch","no-go","proceed"],fix:"Start with your recommendation: go or no-go."},
        {label:"Honest about the bug",keywords:["bug","photo","refresh","restart","issue"],fix:"Mention the known bug clearly."},
        {label:"Risk and plan",keywords:["risk","plan","fix","workaround","monitor","support"],fix:"Explain the risk and your plan, such as a workaround and a fix next week."},
        {label:"Next step",keywords:["next","tomorrow","approve","decision","need"],fix:"End with what you need from the CEO, such as approval."}],
      sampleName:"go-no-go.pdf",
      sampleBad:"Hello CEO. The team has worked hard and the app is nearly ready. We found a small issue with the profile photo not refreshing until the app is restarted. Everyone is doing their best and we hope tomorrow goes well.",
      sampleGood:"Hello CEO. I recommend we go ahead and launch tomorrow. One minor bug remains: the profile photo only refreshes after a restart. The risk is low. My plan: support will share a workaround, Tunde ships the fix next week, and we monitor daily. I need your approval by 5 PM."},
    {t:"11:05",type:"followup",from:"chidi",q:"Why do you think launching with a minor bug is acceptable here?",keywords:["because","minor","impact","drivers","workaround","low","risk","delay","cost"],minWords:8,
      good:"Clear reasoning. You weighed impact against cost of delay.",weak:"Explain the impact of the bug versus the cost of delaying launch."},
    {t:"11:30",type:"decision",q:"Launch with a known bug?",
      a:{title:"Launch tomorrow with the fix planned for next week",detail:"Tell support, write the workaround, and monitor closely.",score:100,fb:"Sound call. The bug is minor, a delay costs more, and you prepared support."},
      b:{title:"Delay launch by one week",detail:"Fix everything first, then release.",score:50,fb:"Safe, but a week of delay for a minor bug has real cost. Weigh impact against risk."}},
    {t:"13:00",type:"break"},
    {t:"14:30",type:"quiz",q:"After launch, what is the best next step?",
      options:["Close the project and move on","Hold a retrospective and track usage metrics","Start a new project straight away","Wait for complaints"],correct:1,why:"Retrospectives and metrics turn one launch into lessons for the next."}
  ]}
  ]
},
/* ============================ JUNIOR SOFTWARE ENGINEER ============================ */
swe:{
  id:"swe", title:"Junior Software Engineer", short:"SWE", manager:"tunde", cls:"v",
  blurb:"Fix real bugs and ship code for a Lagos logistics startup.",
  learn:["Reproduce, fix and test a real bug","Open a clear pull request and respond to review","Choose between a quick hotfix and the safe route","Ship a release and write a short post-mortem"],
  skills:["Debugging","Git and pull requests","Unit testing","Code review","Incident response","Teamwork"],
  jobs:"Junior Developer, QA Engineer, Support Engineer",
  days:[
  {theme:"Fix your first bug",steps:[
    {t:"09:05",type:"msg",from:"tunde",text:"Welcome to the team. Pull the latest from main. Your first ticket is TKT-214: the Pay button on the Driver App sometimes charges twice."},
    {t:"09:30",type:"msg",from:"bisi",text:"I can reproduce it. A double tap on Pay sends two requests. Screenshot is in the ticket."},
    {t:"09:45",type:"reply",from:"tunde",text:"How would you start?",options:[
      {label:"Reproduce it locally, then find where the request is sent",score:100,resp:"Good. Reproduce first, then fix."},
      {label:"Add a random delay to the button",score:30,resp:"That hides the bug instead of fixing it."},
      {label:"Ask a senior to fix it",score:50,resp:"Ask for help when stuck, but try first."}]},
    {t:"10:00",type:"task",title:"Fix TKT-214 and open a pull request",
      brief:"Stop the Pay button from sending a second request while the first is still running. Write your pull request description, or upload a screenshot of your code change.",
      due:"11:15 AM",minWords:40,
      rubric:[
        {label:"Root Cause",keywords:["double","twice","race","timeout","retry","cause"],fix:"Identify the root cause (e.g., double-tap or network timeout retry)."},
        {label:"Implementation specific",keywords:["disable","loading","idempotency","key","state","flag"],fix:"Mention the technical solution (e.g., idempotency key, loading state)."},
        {label:"Failure path handled",keywords:["fail","error","catch","re-enable","retry"],fix:"Explain what happens when the API request fails."},
        {label:"Verification",keywords:["test","unit","manual","reproduce","verified","stripe"],fix:"List specific test cases proving the fix works."}],
      sampleName:"tkt-214-pr.txt",
      sampleBad:"Fixed TKT-214. The Pay button was charging users twice because it sent two requests when tapped quickly. I changed the button code so it only sends one request. Please review my changes.",
      sampleGood:"PR for TKT-214. Cause: A network timeout caused the client to retry a charge request that had already succeeded, and the button lacked debounce protection. Fix: Generated a unique idempotency key per session; added an isSubmitting state to disable the button. Testing: Unit test noDuplicateChargeOnRetry passes; manually simulated a 30s timeout and confirmed only one charge."},
    {t:"11:05",type:"followup",from:"tunde",q:"Why disable the button instead of hiding it or adding a delay?",keywords:["because","user","feedback","loading","retry","reliable","delay","race","clear"],minWords:8,
      good:"Good reasoning. A disabled loading state is clear to users and reliable.",weak:"Think about what the user sees and whether a delay would really prevent the second request."},
    {t:"11:30",type:"decision",q:"Two urgent things, one hour",
      a:{title:"Investigate the production alert",detail:"Drivers cannot see today's route. Reported at 11:20.",score:100,fb:"Right. A live outage beats a pending pull request. Tell Tunde your PR will be late."},
      b:{title:"Finish your pull request for TKT-214",detail:"Tunde wants it before noon.",score:50,fb:"Your PR matters, but drivers are blocked right now. Production issues come first."}},
    {t:"13:00",type:"break"},
    {t:"14:30",type:"quiz",q:"In payments, what is an idempotency key used for?",
      options:["Encrypting card numbers","Making sure the same payment is not processed twice","Speeding up the API","Logging users out"],correct:1,
      why:"The server uses the key to recognise a repeated request and ignore it, which is exactly the double-charge problem."}
  ]},
  {theme:"Tests and code review",steps:[
    {t:"09:00",type:"msg",from:"tunde",text:"Code review day. Your fix works, but Bisi noticed there are no tests for it."},
    {t:"09:20",type:"reply",from:"bisi",text:"Can we merge without tests? The release is close.",options:[
      {label:"No. I will add tests now, it will take 30 minutes",score:100,resp:"Great. That is the habit we want."},
      {label:"Yes, we can add them later",score:30,resp:"Later usually means never. Please add them now."},
      {label:"Ask Tunde to decide",score:55,resp:"Fine, but come with your own view next time."}]},
    {t:"10:00",type:"task",title:"Write 3 unit tests",
      brief:"Write 3 unit tests for the Pay button fix: normal tap, double tap, and failed request. Paste your test names and what each checks.",
      due:"11:15 AM",minWords:35,
      rubric:[
        {label:"Normal tap",keywords:["normal","single","one tap","once","success"],fix:"Add a test for a normal single tap."},
        {label:"Double tap",keywords:["double","twice","two taps","rapid","second"],fix:"Add a test for a double tap that sends only one request."},
        {label:"Failed request",keywords:["fail","error","reject","retry","re-enable"],fix:"Add a test for a failed request."},
        {label:"Clear checks",keywords:["expect","assert","should","checks","calls"],fix:"Say what each test checks, for example expects one call."}],
      sampleName:"tests.txt",
      sampleBad:"Test 1: normal tap. It checks that one tap sends the payment request and shows success. Test 2: double tap. It checks that tapping quickly does not cause problems when the user is in a hurry to pay.",
      sampleGood:"Test 1, normal tap: expect one payment call and a success message. Test 2, double tap: tap twice quickly and assert only one request is sent. Test 3, failed request: mock an error, expect the button to be re-enabled. All three tests pass."},
    {t:"11:05",type:"followup",from:"bisi",q:"Which of your three tests would catch the original bug, and why?",keywords:["double","twice","because","second","request","one","catch"],minWords:8,
      good:"Exactly. The double-tap test protects against this bug coming back.",weak:"Name the test and say what it would detect."},
    {t:"11:30",type:"decision",q:"A small fix is needed in production",
      a:{title:"Edit the file directly on main",detail:"Fastest. No review needed.",score:30,fb:"Never edit main directly. Even a small change can break the build for everyone."},
      b:{title:"Create a branch and open a pull request",detail:"Slightly slower, but reviewed and traceable.",score:100,fb:"Correct. Branch, PR and review keeps the team safe."}},
    {t:"13:00",type:"break"},
    {t:"14:30",type:"quiz",q:"Which HTTP status code means a resource was not found?",options:["200","500","404","401"],correct:2,why:"404 means not found. 500 is a server error and 401 means unauthorised."}
  ]},
  {theme:"Ship and learn",steps:[
    {t:"09:00",type:"msg",from:"tunde",text:"Release day. Your fix is approved and ready to ship."},
    {t:"09:25",type:"reply",from:"tunde",text:"How do you want to handle the release?",options:[
      {label:"Plan the deploy, tell the team and watch the logs after",score:100,resp:"That is how a professional ships."},
      {label:"Deploy and go for lunch",score:20,resp:"Never leave a release unwatched."},
      {label:"Ask someone else to deploy",score:50,resp:"You should learn the deploy process yourself."}]},
    {t:"10:00",type:"task",title:"Write a short post-mortem",
      brief:"Write a half-page post-mortem on the double-charge bug: what happened, why, how you fixed it and how to prevent it.",
      due:"11:15 AM",minWords:50,
      rubric:[
        {label:"What happened",keywords:["happened","charged twice","double charge","impact","users"],fix:"Say what happened and who was affected."},
        {label:"Root cause",keywords:["cause","because","root","two requests","double tap"],fix:"Explain the root cause."},
        {label:"The fix",keywords:["fix","disable","loading","resolved","patched"],fix:"Describe how it was fixed."},
        {label:"Prevention",keywords:["prevent","test","review","monitor","idempotency","alert"],fix:"Say how to prevent it, such as tests, review or idempotency keys."}],
      sampleName:"post-mortem.txt",
      sampleBad:"Post-mortem. Some users were charged twice. The bug was caused by the button sending two requests. We fixed it by disabling the button and everyone worked well together.",
      sampleGood:"Post-mortem. What happened: drivers were charged twice. Root cause: a double tap sent two requests. Fix: button is now disabled with a loading state. Prevention: unit tests for double taps, an idempotency key, and an alert for duplicate charges."},
    {t:"11:05",type:"followup",from:"tunde",q:"What is one thing you would do differently next time?",keywords:["test","earlier","review","would","next time","monitor","check","because"],minWords:8,
      good:"Self-awareness like that makes a strong engineer.",weak:"Pick one concrete thing, like writing the test first."},
    {t:"11:30",type:"decision",q:"It is Friday, 4:30 PM",
      a:{title:"Release now with one reviewer offline",detail:"The fix is ready and the team wants it done.",score:40,fb:"A late Friday release with less coverage is risky."},
      b:{title:"Release Monday morning",detail:"The whole team is online and can react quickly.",score:100,fb:"Good judgement. Ship when you can support what you ship."}},
    {t:"13:00",type:"break"},
    {t:"14:30",type:"quiz",q:"A new release breaks checkout. What is the fastest safe action?",
      options:["Roll back to the last stable version","Debug directly on production","Ignore it until Monday","Restart the server and hope"],correct:0,why:"Roll back first to stop the damage, then investigate calmly."}
  ]}
  ]
},
/* ============================ JUNIOR SOFTWARE ENGINEER ============================ */



/* ============================ DATA ANALYST ============================ */

/* ============================ DATA ANALYST ============================ */
da:{
  id:"da", title:"Data Analyst", short:"DA", manager:"ngozi", cls:"g",
  blurb:"Turn messy delivery data into a recommendation the CEO can act on.",
  learn:["Clean messy data and document what you changed","Find a clear insight and back it with numbers","Present honestly, including what you are unsure about","Answer tough questions under pressure"],
  skills:["Data cleaning","Analysis","Data storytelling","Honesty with data","Presentation","Attention to detail"],
  jobs:"Data Analyst, Business Analyst, Reporting Officer",
  days:[
  {theme:"Clean the messy data",steps:[
    {t:"09:05",type:"msg",from:"ngozi",text:"Good morning, welcome to the data team. Operations wants a delivery delay report, but our delivery sheet is messy: duplicate rows and missing city names."},
    {t:"09:30",type:"msg",from:"femi",text:"Ops here. Late deliveries are up and the CEO is asking why. Can I get something today?"},
    {t:"09:45",type:"reply",from:"ngozi",text:"Where would you start with the file?",options:[
      {label:"Look at the data first: count rows, check duplicates and missing values",score:100,resp:"Good. Know your data before you touch it."},
      {label:"Build charts straight away",score:35,resp:"You would be charting errors. Inspect first."},
      {label:"Delete any row that looks strange",score:30,resp:"Deleting without a rule changes the story. Document every change."}]},
    {t:"10:00",type:"task",title:"Clean the data and summarise your changes",
      brief:"You have 5,000 delivery rows. Clean the duplicates and missing city names, then write a short note on what you changed, with counts before and after.",
      due:"11:15 AM",minWords:40,
      rubric:[
        {label:"Audit Trail",keywords:["before","after","rows","count","from","to"],fix:"Show exact row counts before and after (e.g., 5,000 to 4,810)."},
        {label:"Missing Value Justification",keywords:["missing","null","dropped","filled","because"],fix:"Justify why duplicates were dropped or missing values were filled."},
        {label:"Quantified Insight",keywords:["%","percent","number","data","volume"],fix:"Use specific percentages or numbers to prove the claim."},
        {label:"Actionable Recommendation",keywords:["recommend","pilot","timeline","next step","approve","owner"],fix:"End with a specific next step, timeline, and owner."}],
      sampleName:"cleaning-notes.txt",
      sampleBad:"Cleaning notes. I removed the duplicate rows from the delivery sheet and checked the file again to make sure it looks neat and tidy. The data is now ready for use by the operations team.",
      sampleGood:"Cleaning notes. Before: 5,000 rows. Removed 190 duplicates because the same order was recorded twice. 30 rows had missing city names; filled 22 from address, marked 8 unknown. After: 4,810 rows. Changes logged."},
    {t:"11:05",type:"followup",from:"ngozi",q:"Why did you remove duplicates instead of averaging them?",keywords:["same order","twice","inflate","double","count","because","accuracy","one record"],minWords:8,
      good:"Right. Duplicates inflate counts, so one record per order is correct.",weak:"Think about what happens to counts if one order appears twice."},
    {t:"11:30",type:"decision",q:"The ops head wants a chart in 20 minutes",
      a:{title:"Send a quick chart with a clear note that numbers are preliminary",detail:"Femi gets something now and knows its limits.",score:100,fb:"Good call. Fast and honest."},
      b:{title:"Send the chart without mentioning it is unverified",detail:"It looks clean and finished.",score:30,fb:"That risks decisions based on unchecked numbers."}},
    {t:"13:00",type:"break"},
    {t:"14:30",type:"quiz",q:"A few deliveries took 5 days while most took 1 day. Which measure best shows a typical delivery time?",
      options:["Mean","Median","Maximum","Minimum"],correct:1,why:"The median is not pulled up by a few extreme values."}
  ]},
  {theme:"Find the story",steps:[
    {t:"09:00",type:"msg",from:"ngozi",text:"Day two. The data is clean. Today we find out why deliveries are late."},
    {t:"09:25",type:"reply",from:"femi",text:"I think the drivers are lazy. Can you confirm that in your report?",options:[
      {label:"Say I will check the data and report what it shows, whatever it is",score:100,resp:"Fair enough. I just want to understand the cause."},
      {label:"Agree, to keep Ops happy",score:20,resp:"I would be misled if the data says otherwise."},
      {label:"Ignore the message",score:40,resp:"I still need an answer, please reply."}]},
    {t:"10:00",type:"task",title:"Write 3 insights with numbers",
      brief:"Late deliveries are 18% of orders. Write 3 insights, each with a number, a likely cause and a recommendation.",
      due:"11:15 AM",minWords:50,
      rubric:[
        {label:"Uses numbers",keywords:["%","percent","times","average","rows","orders"],fix:"Support each insight with a number or percentage."},
        {label:"Explains a cause",keywords:["because","due to","caused by","driven by","reason"],fix:"Explain a likely cause for each insight."},
        {label:"Recommends action",keywords:["recommend","should","suggest","action","improve"],fix:"Add a recommendation for each insight."},
        {label:"Specific to deliveries",keywords:["delivery","late","route","city","driver","traffic","time"],fix:"Keep insights specific to deliveries."}],
      sampleName:"insights.txt",
      sampleBad:"Insight 1: Lagos has many late deliveries. Insight 2: Evening orders seem to be delayed more often. Insight 3: Some drivers have more late orders.",
      sampleGood:"Insight 1: 31% of late deliveries are in Lagos Island due to traffic after 4 PM; recommend dispatching earlier. Insight 2: Orders after 6 PM are late 27% of the time due to fewer drivers; add evening drivers. Insight 3: 3 routes cause 40% of delays; review those routes."},
    {t:"11:05",type:"followup",from:"ngozi",q:"Which insight would you act on first, and why?",keywords:["because","impact","largest","most","biggest","percent","%","easy","fastest","cost"],minWords:8,
      good:"Good prioritisation. You tied the choice to impact.",weak:"Choose one insight and give a reason, such as the biggest impact."},
    {t:"11:30",type:"decision",q:"Your data does not match the CEO's belief",
      a:{title:"Present the finding with evidence, politely",detail:"The data shows the delays come from evening staffing, not driver effort.",score:100,fb:"Right. Honest analysis with evidence is your job."},
      b:{title:"Soften the finding so it fits what the CEO expects",detail:"Avoid a difficult conversation.",score:30,fb:"Hiding what the data shows destroys your value as an analyst."}},
    {t:"13:00",type:"break"},
    {t:"14:30",type:"quiz",q:"A chart's y-axis starts at 90 instead of 0, making a small change look huge. This is:",
      options:["Good practice","Misleading","Required for line charts","Faster for viewers"],correct:1,why:"A truncated axis exaggerates differences and can mislead your audience."}
  ]},
  {theme:"Present to the CEO",steps:[
    {t:"09:00",type:"msg",from:"ngozi",text:"Presentation day. The CEO has 10 minutes and wants a clear answer."},
    {t:"09:25",type:"reply",from:"ngozi",text:"How will you open your presentation?",options:[
      {label:"Lead with the finding and the recommendation, then the evidence",score:100,resp:"Yes. Executives want the answer first."},
      {label:"Walk through how I cleaned the data first",score:45,resp:"Too much process. Lead with the answer."},
      {label:"Show every chart I made",score:30,resp:"Too much. Pick the one or two that prove the point."}]},
    {t:"10:00",type:"task",title:"Write a 5-line executive summary",
      brief:"Write a short executive summary for the CEO: the key finding, the evidence, your recommendation and the next step.",
      due:"11:15 AM",minWords:45,
      rubric:[
        {label:"Key finding first",keywords:["finding","found","shows","main","key"],fix:"Open with the key finding."},
        {label:"Evidence",keywords:["%","percent","data","orders","evidence","because"],fix:"Back it up with a number or evidence."},
        {label:"Recommendation",keywords:["recommend","should","suggest","propose"],fix:"State a clear recommendation."},
        {label:"Next step",keywords:["next","by ","timeline","decision","approve","pilot"],fix:"End with a next step and who decides."}],
      sampleName:"executive-summary.txt",
      sampleBad:"Executive summary. We looked at the delivery data for the whole month and prepared a lot of charts for review. The team worked on cleaning and analysing everything carefully.",
      sampleGood:"Key finding: late deliveries are driven by evening staffing, not driver effort. Evidence: orders after 6 PM are late 27% of the time, against 9% earlier. Recommendation: add evening drivers on our 3 busiest routes. Next step: approve a 2-week pilot by Friday."},
    {t:"11:05",type:"followup",from:"ngozi",q:"The CEO may ask: how sure are you? What would you say?",keywords:["confident","sure","limit","caveat","sample","data","verify","because","uncertain","check"],minWords:8,
      good:"Honest about certainty. That builds trust.",weak:"Mention how confident you are and one limit of the data."},
    {t:"11:30",type:"decision",q:"The CEO asks for a number you have not verified",
      a:{title:"Say you will confirm it by 3 PM",detail:"Give an honest time to come back with a checked number.",score:100,fb:"Perfect. Honesty and a clear deadline build trust."},
      b:{title:"Give your best guess as if it is certain",detail:"Sound confident in the room.",score:30,fb:"An unchecked number stated as fact can cost you credibility."}},
    {t:"13:00",type:"break"},
    {t:"14:30",type:"quiz",q:"What should come first in an executive summary?",
      options:["The data cleaning steps","The key finding or recommendation","A list of all charts","Your job title"],correct:1,why:"Busy leaders read the first lines. Put the answer first."}
  ]}
  ]
},
   
/* ============================ HR PERSONNEL ============================ */
hr:{
  id:"hr", title:"HR Personnel", short:"HR", manager:"zainab", cls:"h",
  blurb:"Source, screen, and hire top talent for a growing tech startup.",
  learn:["Write a job description that attracts the right candidates","Screen CVs objectively without unconscious bias","Conduct structured interviews and make an offer"],
  skills:["Sourcing","Screening","Interviewing","Bias mitigation","Negotiation","Onboarding"],
  jobs:"Recruiter, HR Assistant, Talent Acquisition Specialist",
  days:[
  {theme:"Sourcing the right talent",steps:[
    {t:"09:05",type:"msg",from:"zainab",text:"Morning. We need to hire a Junior Data Analyst by next month. I need you to draft the Job Description and figure out where to post it."},
    {t:"09:30",type:"msg",from:"femi",text:"Ops here. Please make sure the JD mentions they will have to work some weekends. We are desperate."},
    {t:"09:45",type:"reply",from:"zainab",text:"How do you handle Femi's request?",options:[
      {label:"Add it, but frame it as 'occasional weekend coverage' with time off in lieu",score:100,resp:"Good. Honest, but attractive."},
      {label:"Tell Femi no, that will scare candidates away",score:40,resp:"We can't hide the reality of the job, it leads to quick turnover."},
      {label:"Leave it out, they can find out later",score:10,resp:"Never bait and switch. That damages our employer brand."}]},
    {t:"10:00",type:"task",title:"Draft the Job Description",
      brief:"Write a 3-paragraph JD for a Junior Data Analyst. Include: 1) The impact they will have, 2) Key responsibilities, 3) Required skills. Avoid gender-coded language.",
      due:"11:15 AM",minWords:40,
      rubric:[
        {label:"Impact First",keywords:["impact","mission","help","grow","business","team"],fix:"Start with why the role matters."},
        {label:"Clear Responsibilities",keywords:["responsibilities","will","tasks","build","analyze","report"],fix:"List 3-4 specific daily tasks."},
        {label:"Inclusive Language",keywords:["collaborate","support","experience","skills","team"],fix:"Avoid aggressive words (e.g., 'ninja', 'dominant') and use inclusive phrasing."},
        {label:"Must-haves vs Nice-to-haves",keywords:["required","preferred","bonus","must","plus"],fix:"Separate essential skills from bonus skills."}],
      sampleName:"jd-draft.pdf",
      sampleBad:"We need a Data Ninja to dominate our data. You must be aggressive and crush numbers. Requirements: SQL, Python, 5 years experience. You will work alone to build dashboards.",
      sampleGood:"About the role: We are looking for a Junior Data Analyst to help Tembea Logistics optimize delivery routes. You will collaborate with our operations team to build dashboards and find insights. Responsibilities include cleaning data, running weekly reports, and presenting findings. Required: 1 year experience with SQL or Excel. Preferred: Python or Tableau."},
    {t:"11:05",type:"followup",from:"zainab",q:"Why did you separate required and preferred skills?",keywords:["because","attract","applicants","overqualified","fair","diverse","pipeline"],minWords:8,
      good:"Exactly. It widens the pool and prevents great candidates from self-selecting out.",weak:"Think about how strict requirements affect who applies."},
    {t:"11:30",type:"decision",q:"Where to post the job",
      a:{title:"Pay $200 for a premium LinkedIn post",detail:"Guarantees high visibility and passive candidates.",score:60,fb:"LinkedIn is good, but expensive for a junior role. You need volume and diversity."},
      b:{title:"Post on free university job boards and Twitter/X",detail:"Targets fresh graduates directly where they hang out.",score:100,fb:"Smart. Cost-effective and targets the exact demographic you need."}},
    {t:"13:00",type:"break"},
    {t:"14:30",type:"quiz",q:"Which of these is an example of gender-coded language in a JD?",
      options:["We are looking for a collaborative team player","You are a dominant and aggressive go-getter","You have strong analytical skills","We offer flexible working hours"],correct:1,why:"Words like 'dominant' and 'aggressive' are statistically proven to deter female applicants."}
  ]},
  {theme:"Screening without bias",steps:[
    {t:"09:00",type:"msg",from:"zainab",text:"Day two. 150 applications came in. We need to screen them down to 5 for interviews."},
    {t:"09:20",type:"reply",from:"zainab",text:"The hiring manager wants to reject anyone who didn't go to a top 5 university. How do you respond?",options:[
      {label:"Push back, and suggest a blind skills-assessment instead",score:100,resp:"Thank you. Let's focus on what they can do, not where they went."},
      {label:"Agree and filter by university",score:20,resp:"That's a huge bias and we will miss great talent."},
      {label:"Compromise and only look at top 10 universities",score:50,resp:"Better, but still biased against non-traditional candidates."}]},
    {t:"10:00",type:"task",title:"Create a screening rubric",
      brief:"Create a 3-point scoring rubric to screen the CVs objectively. What 3 things will you look for to score a candidate from 1-5?",
      due:"11:15 AM",minWords:35,
      rubric:[
        {label:"Relevant Skills",keywords:["skill","sql","excel","python","data","technical"],fix:"Focus on the actual technical skills required."},
        {label:"Portfolio/Projects",keywords:["project","portfolio","github","dashboard","experience"],fix:"Look for evidence of practical work, not just job titles."},
        {label:"Objective Criteria",keywords:["years","degree","certification","clear","measurable"],fix:"Ensure the criteria can be measured objectively."}],
      sampleName:"screening-rubric.txt",
      sampleBad:"1. How good their CV looks. 2. If they went to a good school. 3. If I get a good vibe from their cover letter.",
      sampleGood:"1. Technical skills (1-5): Do they list SQL, Excel, or Python? 2. Practical evidence (1-5): Do they link a portfolio, GitHub, or mention specific projects they built? 3. Communication (1-5): Is the CV clear, free of typos, and well-structured?"},
    {t:"11:05",type:"followup",from:"zainab",q:"How does a structured rubric reduce bias?",keywords:["because","objective","criteria","same","fair","data","gut","feel"],minWords:8,
      good:"Spot on. It replaces 'gut feeling' with data.",weak:"Think about what happens when two recruiters use a rubric vs just reading CVs."},
    {t:"11:30",type:"decision",q:"A candidate is great but has a 2-year employment gap",
      a:{title:"Reject them immediately due to the gap",detail:"It looks unreliable on paper.",score:30,fb:"That's a bias. Employment gaps are normal (caregiving, health, layoffs)."},
      b:{title:"Screen them in, and ask about the gap during the interview",detail:"Focus on their skills first, address the gap later.",score:100,fb:"Correct. The gap doesn't define their ability. Let them explain it."}},
    {t:"13:00",type:"break"},
    {t:"14:30",type:"quiz",q:"What is a 'blind CV' review?",
      options:["Reviewing CVs in the dark","Removing names, photos, and universities before reviewing","Only reading the first page","Letting the AI decide"],correct:1,why:"Blind screening removes demographic markers so hiring managers focus purely on skills."}
  ]},
  {theme:"The Offer & Onboarding",steps:[
    {t:"09:00",type:"msg",from:"zainab",text:"We found our candidate! But they asked for a salary 15% higher than our budget."},
    {t:"09:25",type:"reply",from:"zainab",text:"How do you handle the negotiation?",options:[
      {label:"Offer the lower salary plus a 6-month performance review bonus",score:100,resp:"Excellent. It respects the budget but motivates them."},
      {label:"Reject them and start over",score:20,resp:"We'll lose a great candidate over a small gap."},
      {label:"Give them exactly what they ask for",score:40,resp:"We can't blow the budget, it breaks internal equity."}]},
    {t:"10:00",type:"task",title:"Write the Offer Letter",
      brief:"Draft a short offer email. Include: Start date, Salary, and a warm welcome to the team.",
      due:"11:15 AM",minWords:30,
      rubric:[
        {label:"Clear Terms",keywords:["salary","start date","position","title"],fix:"Include the salary and start date clearly."},
        {label:"Professional Tone",keywords:["excited","welcome","pleasure","offer","team"],fix:"Make it sound welcoming, not robotic."},
        {label:"Next Steps",keywords:["sign","contract","onboarding","reply","accept"],fix:"Tell them exactly how to accept the offer."}],
      sampleName:"offer-email.txt",
      sampleBad:"Hi. You got the job. Salary is 200k. Start on Monday. Let us know.",
      sampleGood:"Dear [Name], We are delighted to offer you the Junior Data Analyst position at Tembea Logistics. Your starting salary will be 200,000 NGN per month, with a start date of November 1st. We were very impressed by your portfolio. Please review the attached contract and reply by Friday to accept. We look forward to welcoming you!"},
    {t:"11:05",type:"followup",from:"zainab",q:"Why is a warm offer email important?",keywords:["excited","culture","impression","candidate","experience","welcome","accept"],minWords:8,
      good:"Yes, the candidate experience starts before Day 1.",weak:"Think about how the candidate feels after a long interview process."},
    {t:"11:30",type:"decision",q:"The candidate accepts! What's next?",
      a:{title:"Send a laptop and wait for Monday",detail:"Let them rest before starting.",score:30,fb:"They will arrive confused. Onboarding starts the moment they sign."},
      b:{title:"Send a welcome pack with the 30-day training plan",detail:"Give them reading material and team intros.",score:100,fb:"Perfect. Day 1 should feel like Day 5 because they already know what to expect."}},
    {t:"13:00",type:"break"},
    {t:"14:30",type:"quiz",q:"What is the main goal of a 30-60-90 day onboarding plan?",
      options:["To test if they will quit","To give them clear goals and expectations for their first 3 months","To make them work weekends","To replace the interview process"],correct:1,why:"A 30-60-90 plan provides a roadmap so the new hire knows exactly how success is measured."}
  ]}
  ]
}
};
/* ---------- Premium mentors (sample profiles) ---------- */
const MENTORS = [
  {id:"m1",name:"Sample Mentor A",title:"Senior Product Manager, fintech",role:"pm",slots:["Sat 10:00 AM","Sat 2:00 PM","Sun 4:00 PM"],color:"#5B2BC4",ini:"SA"},
  {id:"m2",name:"Sample Mentor B",title:"Engineering Manager, logistics tech",role:"swe",slots:["Sat 11:00 AM","Sun 10:00 AM","Sun 5:00 PM"],color:"#0B6E5B",ini:"SB"},
  {id:"m3",name:"Sample Mentor C",title:"Head of Analytics, retail",role:"da",slots:["Sat 1:00 PM","Sun 12:00 PM","Sun 6:00 PM"],color:"#0A5FA8",ini:"SC"},
  {id:"m4",name:"Sample Mentor D",title:"HR Business Partner, tech",role:"hr",slots:["Sat 12:00 PM","Sun 11:00 AM","Sun 7:00 PM"],color:"#D93900",ini:"SD"}
];

/* ---------- Sample candidates for the employer demo (fictional) ---------- */
const SAMPLE_CANDS = [
  {name:"Chiamaka Obi",uni:"University of Nigeria, Nsukka",role:"pm",days:3,s:{punct:100,task:92,dec:100,crit:90,comm:95}},
  {name:"Tobi Adeyemi",uni:"Obafemi Awolowo University",role:"swe",days:3,s:{punct:95,task:90,dec:100,crit:88,comm:82}},
  {name:"Fatima Bello",uni:"Ahmadu Bello University",role:"da",days:3,s:{punct:100,task:94,dec:100,crit:92,comm:90}},
  {name:"Emeka Nwosu",uni:"Covenant University",role:"swe",days:2,s:{punct:90,task:84,dec:80,crit:78,comm:76}},
  {name:"Zainab Ibrahim",uni:"University of Ilorin",role:"pm",days:3,s:{punct:95,task:88,dec:80,crit:85,comm:92}},
  {name:"Seun Ogunleye",uni:"Wale University",role:"da",days:3,s:{punct:100,task:90,dec:100,crit:86,comm:88}},
  {name:"Ngozi Eze",uni:"University of Lagos",role:"pm",days:2,s:{punct:78,task:82,dec:70,crit:74,comm:80}},
  {name:"Ibrahim Sani",uni:"Bayero University Kano",role:"da",days:3,s:{punct:85,task:80,dec:80,crit:82,comm:70}},
  {name:"Blessing Udoh",uni:"University of Uyo",role:"swe",days:3,s:{punct:100,task:96,dec:100,crit:94,comm:90}},
  {name:"Kelechi Okeke",uni:"Nnamdi Azikiwe University",role:"pm",days:1,s:{punct:70,task:76,dec:60,crit:68,comm:74}},
  {name:"Aisha Musa",uni:"Federal University of Technology, Minna",role:"swe",days:3,s:{punct:90,task:86,dec:80,crit:84,comm:78}},
  {name:"David Afolabi",uni:"Wale University",role:"pm",days:3,s:{punct:95,task:91,dec:100,crit:89,comm:93}}
];

const FAQ = [
  ["Is OfficeLife a real job or internship?","No. It is a simulation of a real workday, built from real entry-level tasks. It gives you evidence of what you can do, and employers can check it. It does not replace an internship, it helps you win one."],
  ["How long does it take?","About 10 to 15 minutes per simulated workday. A 1-day simulation takes around 12 minutes, 3 days takes around 40."],
  ["Do I need data or a laptop?","A phone works. The app is a single light page that loads on slow connections, and it keeps working if the AI reviewer is offline."],
  ["How are my tasks reviewed?","By our AI reviewer when it is online, and by a built-in rule-based reviewer when it is not, so you always get feedback. Premium adds a human mentor review of your final project."],
  ["Can employers trust the certificate?","Every certificate has a verification link and QR code. It shows clock-in record, task scores, decisions and the method used to review each task, so employers see evidence, not just a badge."],
  ["Why do you ask for my university?","So your university can see how its students are doing, and so employers can find graduates from specific campuses. You can change it later."]
];
