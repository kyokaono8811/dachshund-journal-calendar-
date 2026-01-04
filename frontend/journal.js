// ========================================
// Journal App JS
// Full functionality: Calendar, Journal Entries, AI Insights, Dachshund Animation, Background, etc.
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    // Load Pacifico font early
    const font = new FontFace('Pacifico', 'url(https://fonts.googleapis.com/css2?family=Pacifico&display=swap)');
    font.load().then(() => {
        document.fonts.add(font);
        console.log("Pacifico font loaded");
    }).catch(e => console.log("Font load failed:", e));

   // ------------------------
   // INITIAL VARIABLES
   // ------------------------
   let viewDate = new Date(); // Controls which month is displayed

   // ------------------------
   // DACHSHUND WALKING ANIMATION
   // ------------------------
   const dachshundFrames = {
       dog1: ['dachshund1_frame1.png', 'dachshund1_frame2.png', 'dachshund1_frame3.png', 'dachshund1_frame4.png'],
       dog2: ['dachshund2_frame1.png', 'dachshund2_frame2.png', 'dachshund2_frame3.png', 'dachshund2_frame4.png'],
       dog3: ['dachshund3_frame1.png', 'dachshund3_frame2.png', 'dachshund3_frame3.png', 'dachshund3_frame4.png']
   };

   let frameIndexes = { dog1: 0, dog2: 0, dog3: 0 };

   // Animate frames for walking effect
   function animateDachshundWalking() {
       ['dog1', 'dog2', 'dog3'].forEach((dog, index) => {
           const dogElement = document.getElementById(`dachshund${index + 1}`);
           if (dogElement) {
               frameIndexes[dog] = (frameIndexes[dog] + 1) % 4;
               dogElement.src = dachshundFrames[dog][frameIndexes[dog]];
           }
       });
   }

   // Start frame animation (change frame every 200ms for walking effect)
   setInterval(animateDachshundWalking, 200);

   // ------------------------
   // DACHSHUND BARK ON CLICK
   // ------------------------
   function playBarkSound() {
       const sound = document.getElementById('barkSound');
       if (sound) {
           sound.currentTime = 0;
           sound.play().catch(e => console.log("Bark sound failed:", e));
       }
   }

   // Add click handlers to all dachshunds
   document.getElementById('dachshund1')?.addEventListener('click', playBarkSound);
   document.getElementById('dachshund2')?.addEventListener('click', playBarkSound);
   document.getElementById('dachshund3')?.addEventListener('click', playBarkSound);

   // ------------------------
   // HANDLE DAY CLICK (OPEN MODAL AND SAVE ENTRY)
   // ------------------------
   function handleDayClick(dayDiv) {
       playClickSound();
   
       const dayNum = dayDiv.innerText;
       const month = viewDate.getMonth() + 1;
       const year = viewDate.getFullYear();
   
       const key = `${month}-${dayNum}-${year}`;
       const textKey = `${key}-text`;
   
       // Load previous entry if it exists
       const prevText = localStorage.getItem(textKey) || "";
       const parts = prevText.split("||");
   
       document.getElementById("journalFeeling").value = parts[0] || "";
       document.getElementById("journalThankful").value = parts[1] || "";
       document.getElementById("journalGoal").value = parts[2] || "";
   
       // Show modal
       document.getElementById("journalModal").style.display = "flex";
   
       // Remove old click listeners from the button to prevent duplicates
       const oldButton = document.getElementById("saveJournalBtn");
       const newButton = oldButton.cloneNode(true);
       oldButton.parentNode.replaceChild(newButton, oldButton);
   
       // Save button click
       newButton.addEventListener("click", () => {
           const newFeeling = document.getElementById("journalFeeling").value.trim();
           const newThankful = document.getElementById("journalThankful").value.trim();
           const newGoal = document.getElementById("journalGoal").value.trim();
   
           const combinedText = `${newFeeling}||${newThankful}||${newGoal}`;
           const alreadyCompleted = localStorage.getItem(key) === "true";
   
           // Save to localStorage
           localStorage.setItem(textKey, combinedText);
           localStorage.setItem(key, "true"); // mark day as completed
       
           dayDiv.classList.add("completed");

           // Update totalDays counter only if new entry
           if (!alreadyCompleted) {
               const totalDaysEl = document.getElementById("totalDays");
               const [completed, max] = totalDaysEl.innerText.split("/");
               totalDaysEl.innerText = `${Number(completed) + 1}/${max}`;
           }
   
           // Refresh Journal List
           showJournalList();
   
           // Close modal
           closeJournalPopup();
       });
   }
   
   // ------------------------
   // CLOSE JOURNAL MODAL
   // ------------------------
   function closeJournalPopup() {
       document.getElementById("journalModal").style.display = "none";
   }

   document.getElementById("closeModal").onclick = closeJournalPopup;

   // ------------------------
   // START BUTTON FUNCTIONALITY
   // ------------------------
   document.getElementById("startButton").onclick = function() {
       document.getElementById("startScreen").style.display = "none";
       document.getElementById("mainApp").style.display = "block";
       initializeCalendar();
   };

   // ------------------------
   // HAMBURGER MENU FUNCTIONALITY
   // ------------------------
   var hamburger = document.getElementById("hamburger");
   var sideMenu = document.getElementById("sideMenu");

   hamburger.onclick = function() {
       sideMenu.classList.toggle("open");
   };

   document.getElementById("calendarMenu").onclick = function(e) {
       e.stopPropagation();
       document.getElementById("calendarPage").style.display = "block";
       document.getElementById("listPage").style.display = "none";
       document.getElementById("insightsPage").style.display = "none";
       sideMenu.classList.remove("open");
   };

   document.getElementById("listMenu").onclick = function(e) {
       e.stopPropagation();
       document.getElementById("calendarPage").style.display = "none";
       document.getElementById("listPage").style.display = "block";
       document.getElementById("insightsPage").style.display = "none";
       showJournalList();
       sideMenu.classList.remove("open");
   };

   document.getElementById("insightsMenu").onclick = function(e){
       e.stopPropagation();
       document.getElementById("calendarPage").style.display = "none";
       document.getElementById("listPage").style.display = "none";
       document.getElementById("insightsPage").style.display = "block";
       loadAIInsights();
       sideMenu.classList.remove("open");
   };

   // ------------------------
   // MONTH NAVIGATION
   // ------------------------
   document.getElementById("prevMonth").onclick = function(e) {
       e.stopPropagation();
       viewDate.setMonth(viewDate.getMonth() - 1);
       initializeCalendar();
   };

   document.getElementById("nextMonth").onclick = function(e) {
       e.stopPropagation();
       const now = new Date();
       const maxFuture = new Date(now.getFullYear(), now.getMonth() + 1, 1);

       if (viewDate < maxFuture) {
           viewDate.setMonth(viewDate.getMonth() + 1);
           initializeCalendar();
       }
   };

   // ------------------------
   // DELETE JOURNAL ENTRY
   // ------------------------
   window.deleteJournal = function(month, day, year) {
       let key = `${month}-${day}-${year}-text`;
       let statusKey = `${month}-${day}-${year}`;

       localStorage.removeItem(key);
       localStorage.removeItem(statusKey);
       showJournalList();
       initializeCalendar();
   };

   // ------------------------
   // SHOW JOURNAL LIST WITH YEAR/MONTH NAVIGATION
   // ------------------------
   function showJournalList() {
       let list = document.getElementById("journalList");
       list.innerHTML = "";

       const entries = [];

       // Scan all localStorage keys
       for (let i = 0; i < localStorage.length; i++) {
           const key = localStorage.key(i);

           if (key.endsWith("-text")) {
               const text = localStorage.getItem(key);
               const [month, day, year] = key.replace("-text", "").split("-");

               entries.push({
                   month: Number(month),
                   day: Number(day),
                   year: Number(year),
                   text: text
               });
           }
       }

       if (entries.length === 0) {
           list.innerHTML = '<div style="text-align:center; padding:40px; font-size:22px; color:#666;">No journal entries yet. Start writing!</div>';
           return;
       }

       // Group entries by year
       const entriesByYear = {};
       entries.forEach(entry => {
           if (!entriesByYear[entry.year]) {
               entriesByYear[entry.year] = [];
           }
           entriesByYear[entry.year].push(entry);
       });

       // Sort years descending (newest first)
       const years = Object.keys(entriesByYear).sort((a, b) => b - a);

       // Create year sections
       years.forEach(year => {
           // Year container
           const yearDiv = document.createElement("div");
           yearDiv.className = "yearContainer";
           yearDiv.style.marginBottom = "30px";

           // Year header (clickable)
           const yearHeader = document.createElement("div");
           yearHeader.className = "yearHeader";
           yearHeader.innerHTML = `
               <span style="font-size:32px; font-weight:bold; cursor:pointer;">
                   ${year} <span class="expandIcon">▼</span>
               </span>
           `;
           yearHeader.style.padding = "15px";
           yearHeader.style.background = "#81f5e3";
           yearHeader.style.border = "3px solid brown";
           yearHeader.style.borderRadius = "15px";
           yearHeader.style.cursor = "pointer";
           yearHeader.style.marginBottom = "15px";
           yearHeader.style.textAlign = "center";

           // Month content container (hidden initially)
           const monthContent = document.createElement("div");
           monthContent.className = "monthContent";
           monthContent.style.display = "none";
           monthContent.style.paddingLeft = "20px";

           // Group entries by month within this year
           const entriesByMonth = {};
           entriesByYear[year].forEach(entry => {
               if (!entriesByMonth[entry.month]) {
                   entriesByMonth[entry.month] = [];
               }
               entriesByMonth[entry.month].push(entry);
           });

           // Sort months descending
           const months = Object.keys(entriesByMonth).sort((a, b) => b - a);
           const monthNames = [
               "January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"
           ];

           // Create month sections
           months.forEach(monthNum => {
               const monthDiv = document.createElement("div");
               monthDiv.className = "monthContainer";
               monthDiv.style.marginBottom = "20px";

               // Month header (clickable)
               const monthHeader = document.createElement("div");
               monthHeader.className = "monthHeader";
               monthHeader.innerHTML = `
                   <span style="font-size:26px; font-weight:bold; cursor:pointer;">
                       ${monthNames[monthNum - 1]} <span class="expandIconMonth">▼</span>
                   </span>
               `;
               monthHeader.style.padding = "12px";
               monthHeader.style.background = "#b8f3ea";
               monthHeader.style.border = "2px solid brown";
               monthHeader.style.borderRadius = "12px";
               monthHeader.style.cursor = "pointer";
               monthHeader.style.marginBottom = "10px";

               // Entries container (hidden initially)
               const entriesContainer = document.createElement("div");
               entriesContainer.className = "entriesContainer";
               entriesContainer.style.display = "none";
               entriesContainer.style.paddingLeft = "15px";

               // Sort entries by day descending
               const monthEntries = entriesByMonth[monthNum].sort((a, b) => b.day - a.day);

               // Create individual entry items
               monthEntries.forEach(entry => {
                   const entryDiv = document.createElement("div");
                   entryDiv.className = "journalItem";

                   const [feeling, thankful, goal] = entry.text.split("||");

                   entryDiv.innerHTML = `
                       <div style="font-size:22px; font-weight:bold; margin-bottom:10px; font-family: 'Pacifico', cursive;">
                           ${entry.month}/${entry.day}/${entry.year}
                       </div>
                       <div style="font-size:18px; margin-bottom:8px; font-family: 'Pacifico', cursive;">
                           <strong>Feeling:</strong> ${feeling || ""}
                       </div>
                       <div style="font-size:18px; margin-bottom:8px; font-family: 'Pacifico', cursive;">
                           <strong>Thankful for:</strong> ${thankful || ""}
                       </div>
                       <div style="font-size:18px; margin-bottom:8px; font-family: 'Pacifico', cursive;">
                           <strong>Goal:</strong> ${goal || ""}                
                       </div>
                       <button class="trashButton" style="margin-top:5px;"
                           onclick="playTrashSound(); deleteJournal(${entry.month}, ${entry.day}, ${entry.year})">
                           🗑️ 
                       </button>
                   `;

                   entriesContainer.appendChild(entryDiv);
               });

               // Toggle month entries
               monthHeader.onclick = function() {
                   playClickSound();
                   const icon = this.querySelector(".expandIconMonth");
                   if (entriesContainer.style.display === "none") {
                       entriesContainer.style.display = "block";
                       icon.textContent = "▲";
                   } else {
                       entriesContainer.style.display = "none";
                       icon.textContent = "▼";
                   }
               };

               monthDiv.appendChild(monthHeader);
               monthDiv.appendChild(entriesContainer);
               monthContent.appendChild(monthDiv);
           });

           // Toggle year months
           yearHeader.onclick = function() {
               playClickSound();
               const icon = this.querySelector(".expandIcon");
               if (monthContent.style.display === "none") {
                   monthContent.style.display = "block";
                   icon.textContent = "▲";
               } else {
                   monthContent.style.display = "none";
                   icon.textContent = "▼";
               }
           };

           yearDiv.appendChild(yearHeader);
           yearDiv.appendChild(monthContent);
           list.appendChild(yearDiv);
       });
   }

   window.playTrashSound = function() {
       const sound = document.getElementById('trashSound');
       if (!sound) return;
       sound.currentTime = 0;
       sound.play().catch(e => console.log("Trash sound failed:", e));
   };

   // ------------------------
   // INITIALIZE CALENDAR
   // ------------------------
   function initializeCalendar() {
       const today = new Date();
       let currentMonth = viewDate.getMonth();
       let currentYear = viewDate.getFullYear();
       let currentDate = today.getDate();

       const months = [
           "January","February","March","April","May","June",
           "July","August","September","October","November","December"
       ];

       document.getElementById("title").innerText = months[currentMonth];
       document.getElementById("year").innerText = currentYear;

       const daysInThisMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
       let daysCompleted = 0;
       const totalDays = document.getElementById("totalDays");
       totalDays.innerText = `0/${daysInThisMonth}`;

       let dayCount = 0;
       const daysRows = document.getElementsByClassName("days");

       for (let i = 0; i < daysRows.length; i++) {
           const dayDivs = daysRows[i].getElementsByClassName("day");

           for (let j = 0; j < dayDivs.length; j++) {
               const dayDiv = dayDivs[j];

               dayDiv.classList.remove("disabled");
               //dayDiv.style.backgroundColor = "white";
               dayDiv.style.border = "none";
               dayDiv.onclick = null;

               // Highlight current day
               if (dayCount === currentDate - 1 && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                   dayDiv.style.border = "2px solid brown";
               }

               if (dayCount < daysInThisMonth) {
                   dayDiv.innerText = dayCount + 1;

                   const isFutureMonth = currentYear > today.getFullYear() || 
                                         (currentYear === today.getFullYear() && currentMonth > today.getMonth());

                   const isFutureDay = !isFutureMonth && currentYear === today.getFullYear() && 
                                       currentMonth === today.getMonth() && 
                                       dayCount + 1 > currentDate;

                   if (isFutureMonth || isFutureDay) {
                       dayDiv.classList.add("disabled");
                   }

                   dayDiv.setAttribute("id", "day" + (dayCount + 1));
                   dayCount++;
               } else {
                   dayDiv.innerText = "";
               }
           }
       }

       // Initialize localStorage for days
       for (let i = 0; i < dayCount; i++) {
           const tempString = `${currentMonth + 1}-${i + 1}-${currentYear}`;
           const tempDay = localStorage.getItem(tempString);
           if (tempDay == null || tempDay === "false") {
               localStorage.setItem(tempString, "false");
           } else if (tempDay === "true") {
               daysCompleted++;
           }
       }

       totalDays.innerText = `${daysCompleted}/${daysInThisMonth}`;

      // Update calendar day classes
       for (let i = 0; i < daysInThisMonth; i++) {
           const tempString = `${currentMonth + 1}-${i + 1}-${currentYear}`;
           const chosenDay = localStorage.getItem(tempString);
           const chosenDayDiv = document.getElementById("day" + (i + 1));

           if (!chosenDayDiv) continue;

           chosenDayDiv.classList.remove("completed");

           if (chosenDay === "true") {
               chosenDayDiv.classList.add("completed");
           }
       }


       // Attach click event to calendar content
       document.getElementById("calendarContent").addEventListener("click", function(e) {
           const dayDiv = e.target.closest(".day");
           if (!dayDiv) return;
           if (dayDiv.classList.contains("disabled")) return;
           if (!dayDiv.innerText) return;
           e.stopPropagation();
           handleDayClick(dayDiv);
       });
   }

   // ========================================
   // REST OF YOUR JS
   // (walkDachshund, setBackgroundByTime, AI Insights, etc.)
   // Keep all your previous code for dachshund walking, background time, sentiment analysis as-is
   // ========================================

   // ------------------------
   // CLICK SOUNDS FOR SPECIFIC BUTTONS
   // ------------------------
   function playClickSound() {
       const sound = document.getElementById("clickSound");
       if (sound) {
           sound.currentTime = 0;
           sound.play().catch(e => console.log("Sound play failed:", e));
       }
   }

   // Add click sounds ONLY to these buttons
   document.getElementById("prevMonth").addEventListener("click",playClickSound);
   document.getElementById("nextMonth").addEventListener("click",playClickSound);
   document.getElementById("hamburger").addEventListener("click",playClickSound);
   document.getElementById("calendarMenu").addEventListener("click",playClickSound);
   document.getElementById("listMenu").addEventListener("click",playClickSound);
   document.getElementById("insightsMenu").addEventListener("click",playClickSound);
   document.getElementById("saveJournalBtn").addEventListener("click",playClickSound);
   document.getElementById("startButton").addEventListener("click",playClickSound);

   // ------------------------
   // SET BACKGROUND BASED ON TIME
   // ------------------------
   function setBackgroundByTime() {
       const hour = new Date().getHours();
       const mainApp = document.getElementById("mainApp");

       if (!mainApp) return;

       mainApp.classList.remove("morning", "day", "night");

       if (hour >= 4 && hour < 8) mainApp.classList.add("morning");
       else if (hour >= 8 && hour < 17) mainApp.classList.add("day");
       else mainApp.classList.add("night");
   }

   setBackgroundByTime();
   setInterval(setBackgroundByTime, 60 * 1000);
   console.log("Background class:", document.getElementById("mainApp").className);

   // ------------------------
   // CANVAS PREPARATION (FIXES FIRST-LOAD MISALIGNMENT)
   // ------------------------
   function prepareCanvas(canvas, cssWidth = 400, cssHeight = 250) {
       const scale = window.devicePixelRatio || 1;

       canvas.style.width = cssWidth + "px";
       canvas.style.height = cssHeight + "px";

       canvas.width = cssWidth * scale;
       canvas.height = cssHeight * scale;

       const ctx = canvas.getContext("2d");
       ctx.setTransform(scale, 0, 0, scale, 0, 0);

       return ctx;
   }


   // ------------------------
   // AI SENTIMENT ANALYSIS
   // ------------------------
   // Keyword fallback and BERT async analysis
   function analyzeKeywordSentiment(text) {
       const lowerText = text.toLowerCase();

       const positiveWords = ['happy','joy','great','amazing','wonderful','love','excited',
                              'grateful','blessed','thankful','good','better','best','awesome',
                              'fantastic','excellent','perfect','beautiful','fun','enjoyed'];

       const negativeWords = ['sad','angry','terrible','awful','hate','depressed','anxious',
                              'worried','stressed','bad','worst','horrible','difficult','hard',
                              'frustrating','upset','disappointed','lonely','tired','exhausted'];

       let positiveCount = 0;
       let negativeCount = 0;

       positiveWords.forEach(word => { if(lowerText.includes(word)) positiveCount++; });
       negativeWords.forEach(word => { if(lowerText.includes(word)) negativeCount++; });

       if (positiveCount > negativeCount) return { label: 'POSITIVE', score: Math.min(0.95, 0.7 + (positiveCount * 0.05)) };
       else if (negativeCount > positiveCount) return { label: 'NEGATIVE', score: Math.min(0.95, 0.7 + (negativeCount * 0.05)) };
       else return { label: 'NEUTRAL', score: 0.6 };
   }

   async function analyzeSentimentBERT(text) {
    try {
        // Detect the current host and use the same host for the API
        const apiHost = window.location.hostname;
        const response = await fetch(`http://${apiHost}:3000/api/analyze-sentiment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) throw new Error('Backend request failed');

        const result = await response.json();
        console.log('✅ Using BERT sentiment analysis'); // ADD THIS
        return { label: result.label, score: result.score };
    } catch (error) {
        console.log('⚠️ Using keyword analysis:', error.message); // ALREADY THERE
        return analyzeKeywordSentiment(text);
    }
}

   function getJournalEntries() {
       const entries = [];
   
       for (let i = 0; i < localStorage.length; i++) {
           const key = localStorage.key(i);
   
           if (key.endsWith("-text")) {
               const text = localStorage.getItem(key);
               const [month, day, year] = key.replace("-text", "").split("-").map(Number);
   
               // Skip invalid keys
               if (!month || !day || !year) continue;
   
               entries.push({
                   month,
                   day,
                   year,
                   text,
                   date: new Date(year, month - 1, day)
               });
           }
       }
   
       return entries;
   }
   

   function getCurrentWeekRange() {
       const now = new Date();
   
       // JS: Sun=0, Mon=1, Tue=2... Sat=6
       const day = now.getDay();
   
       // Convert so Monday is start of week
       const diffToMonday = (day === 0 ? -6 : 1) - day;
   
       const monday = new Date(now);
       monday.setDate(now.getDate() + diffToMonday);
       monday.setHours(0, 0, 0, 0);
   
       const sunday = new Date(monday);
       sunday.setDate(monday.getDate() + 6);
       sunday.setHours(23, 59, 59, 999);
   
       return { monday, sunday };
   }

   async function showEmptyCanvas(canvasId, message, fontSize = 20) {
       const canvas = document.getElementById(canvasId);
       if (!canvas) return;
   
       // Wait for fonts to be loaded
       await document.fonts.ready;
   
       // Use the SAME canvas setup as the chart functions (not prepareCanvas)
       const ctx = canvas.getContext('2d');
       canvas.width = 400;
       canvas.height = 250;
   
       // Clear
       ctx.clearRect(0, 0, canvas.width, canvas.height);
   
       // Text style
       ctx.fillStyle = "#333";
       ctx.font = `${fontSize}px 'Pacifico', cursive`;
       ctx.textAlign = "center";
       ctx.textBaseline = "middle";
   
       // Center text at the same position where charts would be drawn
       const x = canvas.width / 2;
       const y = canvas.height / 2;
       ctx.fillText(message, x, y);
   }    
   
   async function loadAIInsights() {

       const insightsPage = document.getElementById('insightsPage');
       const domEmotion = document.getElementById('dominantEmotion');
       const desc = document.getElementById('emotionDescription');
       const sentimentCanvas = document.getElementById('sentimentChart');
       const emotionCanvas = document.getElementById('emotionPieChart');
   
       // 1️⃣ Show page
       insightsPage.style.display = 'block';

       // 2️⃣ Wait for layout + styles + fonts to settle
       await new Promise(requestAnimationFrame);
       await new Promise(requestAnimationFrame);

       // 3️⃣ Ensure font is ready
       await document.fonts.ready;

   
       // 4️⃣ Pull all saved journal entries
       const allEntries = getJournalEntries().filter(e => e.text.trim() !== "");
       const { monday, sunday } = getCurrentWeekRange();
       const weekEntries = allEntries.filter(entry => entry.date >= monday && entry.date <= sunday);
   
       // --------------------------
       // HANDLE EMPTY WEEK
       // --------------------------
       if (weekEntries.length === 0) {
           domEmotion.innerHTML = '';
           desc.innerHTML = `
               <div style="
                   transform: translateY(-100px); 
                   font-size:24px; 
                   text-align:center; 
                   font-family: 'Pacifico', cursive;">
                   No journal entries yet. Start writing to see your Weekly Emotional Overview!
               </div>
           `;
           if (sentimentCanvas) sentimentCanvas.style.transform = '';
           if (emotionCanvas) emotionCanvas.style.transform = '';
   
           showEmptyCanvas('sentimentChart', 'No emotion data this week', 24);
           showEmptyCanvas('emotionPieChart', 'No emotion data this week', 24);
           return;
       }
   
       // --------------------------
// NORMAL WEEK: reset canvases properly
// --------------------------

// Set "Analyzing..." in Weekly Emotion Summary
// Set "Analyzing..." in Weekly Emotion Summary
domEmotion.innerHTML = `
    <div style="
        font-family: 'Pacifico', cursive;
        font-size: 30px; 
        text-align: center;
        color: #333;
        transform: translateY(-100px);">
        Analyzing...
    </div>
`;
desc.innerHTML = '';

if (sentimentCanvas) {
    const ctx1 = sentimentCanvas.getContext('2d');
    sentimentCanvas.width = 400;
    sentimentCanvas.height = 250;
    ctx1.clearRect(0, 0, 400, 250);
    
    // Add "Analyzing..." text
    ctx1.fillStyle = "#333";
    ctx1.font = "24px 'Pacifico', cursive";
    ctx1.textAlign = "center";
    ctx1.textBaseline = "middle";
    ctx1.fillText("Analyzing...", 200, 125);
}
if (emotionCanvas) {
    const ctx2 = emotionCanvas.getContext('2d');
    emotionCanvas.width = 400;
    emotionCanvas.height = 250;
    ctx2.clearRect(0, 0, 400, 250);
    
    // Add "Analyzing..." text
    ctx2.fillStyle = "#333";
    ctx2.font = "24px 'Pacifico', cursive";
    ctx2.textAlign = "center";
    ctx2.textBaseline = "middle";
    ctx2.fillText("Analyzing...", 200, 125);
}
       //desc.innerHTML = 'Analyzing...';
       //desc.innerHTML = `
            //<div style="
                //font-family: 'Pacifico', cursive;
                //font-size: 28px; 
                //text-align: center;
                //transform: translateY(-50px);">
                //Analyzing...
            //</div>
        //`;

   
       // --------------------------
       // Analyze sentiment
       // --------------------------
       const sentimentPromises = weekEntries.map(async entry => {
           const sentiment = await analyzeSentimentBERT(entry.text);
           return { ...entry, sentiment };
       });
   
       const analyzedEntries = await Promise.all(sentimentPromises);
   
       // --------------------------
       // Display summary + charts
       // --------------------------
       displayWeeklySummary(analyzedEntries);
       createSentimentChart(analyzedEntries);
       createEmotionPieChart(analyzedEntries);
   }


   // ------------------------
   // DISPLAY WEEKLY SUMMARY
   // ------------------------
   // High-level emotional snapshot. 
   // This function answers: "Overall...how was my week emotionally?"
   function displayWeeklySummary(entries) {
       let positiveCount = 0, negativeCount = 0, totalScore = 0;
   
       entries.forEach(entry => {
           if (entry.sentiment.label === 'POSITIVE') positiveCount++;
           else if (entry.sentiment.label === 'NEGATIVE') negativeCount++;
           totalScore += entry.sentiment.score;
       });
   
       const avgScore = totalScore / entries.length;
       let dominantEmotion;
   
       if (positiveCount > negativeCount) dominantEmotion = { img: 'positive.png', text: 'Mostly Positive' };
       else if (negativeCount > positiveCount) dominantEmotion = { img: 'negative.png', text: 'Mostly Negative' };
       else dominantEmotion = { img: 'balanced.png', text: 'Balanced' };
   
       // Update DOM
       //document.getElementById('dominantEmotion').innerHTML = `<img src="${dominantEmotion.img}" alt="${dominantEmotion.text}">`;
       document.getElementById('dominantEmotion').innerHTML = `
           <div style="text-align:center;">
               <img src="${dominantEmotion.img}" alt="${dominantEmotion.text}" 
                   style="display:block; margin:0 auto; width:200px; height:200px;"/>
           </div>
       `;

       document.getElementById('emotionDescription').innerHTML =
           `<strong>${dominantEmotion.text}</strong><br>` +
           `${positiveCount} positive days, ${negativeCount} negative days<br>` +
           `Happiness Level: ${(avgScore * 100).toFixed(0)}%`;
   }    

   // ------------------------
   // CREATE SENTIMENT LINE CHART
   // ------------------------
   // This draws the line graph using the <canvas> API (not Chart.js) 
   function createSentimentChart(entries) {
       const canvas = document.getElementById('sentimentChart');
       if (!canvas) return;
       const ctx = canvas.getContext('2d');
       canvas.width = 400;
       canvas.height = 250;
       
       ctx.clearRect(0, 0, canvas.width, canvas.height);
   
       const topPadding = 30;    // moves the graph down - reduced for better positioning
       const bottomPadding = 40; // space below the dots
       const leftPadding = 30;
       const rightPadding = 30;

       const width = 400 - leftPadding - rightPadding;
       const height = 250 - topPadding - bottomPadding;

   
       const { monday } = getCurrentWeekRange();
       const today = new Date();
       today.setHours(0,0,0,0);
   
       const weekDates = [];
       for (let i = 0; i < 7; i++) {
           const d = new Date(monday);
           d.setDate(monday.getDate() + i);
           weekDates.push(d);
       }
   
       const weekScores = weekDates.map(d => {
           const entry = entries.find(e =>
               e.date.getFullYear() === d.getFullYear() &&
               e.date.getMonth() === d.getMonth() &&
               e.date.getDate() === d.getDate()
           );
           if (!entry && d < today) return 0;
           if (!entry && d >= today) return null;
           return entry.sentiment.score;
       });
   
       const validScores = weekScores.filter(s => s !== null);
       const maxScore = validScores.length ? Math.max(...validScores, 1) : 1;
       const minScore = validScores.length ? Math.min(...validScores, 0) : 0;
   
       const points = weekScores.map((score, i) => {
           if (score === null) return null;
           const x = leftPadding + (width / 6) * i;
           const y = topPadding + height - ((score - minScore) / (maxScore - minScore || 1)) * height;

           return { x, y };
       });
   
       // -------------------
       // Animate Line Drawing
       // -------------------
       let progress = 0; // from 0 to 1
       const animationDuration = 1000; // 1 second
       const startTime = performance.now();
   
       function drawFrame(now) {
           const elapsed = now - startTime;
           progress = Math.min(elapsed / animationDuration, 1);
   
           // Clear
           ctx.clearRect(0, 0, canvas.width, canvas.height);
   
           // Draw axes
           ctx.strokeStyle = "#ccc";
           ctx.lineWidth = 1;
           ctx.beginPath();
           ctx.moveTo(leftPadding, topPadding);
           ctx.lineTo(leftPadding, 250 - bottomPadding);
           ctx.lineTo(400 - rightPadding, 250 - bottomPadding);
           ctx.stroke();
   
           // Draw line
           ctx.strokeStyle = "#00CCC";
           ctx.lineWidth = 2;
           ctx.beginPath();
           let started = false;
           for (let i = 0; i < points.length; i++) {
               const pt = points[i];
               if (!pt) continue;
               const x = pt.x * progress + leftPadding * (1 - progress); // animate X
               const y = pt.y;
               if (!started) {
                   ctx.moveTo(x, y);
                   started = true;
               } else {
                   ctx.lineTo(x, y);
               }
           }
           ctx.stroke();
   
           // Draw dots with pop-in
           points.forEach((pt, i) => {
               if (!pt) return;
               const delay = i * 100; // stagger each dot
               const dotProgress = Math.min(Math.max((elapsed - delay) / 300, 0), 1); // 0 → 1
               const radius = 5 * dotProgress; // grow dot
               ctx.fillStyle = "#00cccc";
               ctx.beginPath();
               ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
               ctx.fill();
           });
   
           // Draw day labels
           const dayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
           ctx.fillStyle = "black";
           ctx.font = "12px Arial";
           dayLabels.forEach((label, i) => {
               const x = leftPadding + (width / 6) * i;
               const y = 250 - bottomPadding + 15;
               ctx.fillText(label, x - 10, y);
           });
   
           if (progress < 1) requestAnimationFrame(drawFrame);
       }
   
       requestAnimationFrame(drawFrame);
   }
   
   
   // ------------------------
   // CREATE EMOTION PIE CHART
   // ------------------------

   // Distribution snapshot
   function createEmotionPieChart(entries) {
       const canvas = document.getElementById('emotionPieChart');
       if (!canvas) return;
       const ctx = canvas.getContext('2d');
       canvas.width = 400;
       canvas.height = 250;
   
       ctx.clearRect(0, 0, canvas.width, canvas.height);
   
       const counts = { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 };
       entries.forEach(e => counts[e.sentiment.label]++);
       const total = entries.length;
       const colors = { POSITIVE: '#fcd1d7', NEGATIVE: '#C6FCFF', NEUTRAL: '#D6F6D5' };
   
       let startAngle = -0.5 * Math.PI;
   
       Object.keys(counts).forEach(label => {
           const sliceAngle = (counts[label] / total) * Math.PI * 2;
           const centerX = 400 / 2 - 10;
           const centerY = 250 / 2 - 15;  // adjusted to move pie chart down
           ctx.fillStyle = colors[label];
           ctx.beginPath();
           ctx.moveTo(centerX, centerY);
           ctx.arc(centerX, centerY, 400 / 4.5, startAngle, startAngle + sliceAngle);
           ctx.closePath();
           ctx.fill();
           startAngle += sliceAngle;
       });

       // -------------------
       // DRAW SIDE LEGEND
       // -------------------
       const legend = [
           { label: "Positive", color: "#fcd1d7" },
           { label: "Negative", color: "#C6FCFF" },
           { label: "Neutral", color: "#D6F6D5" }
       ];

       ctx.font = "14px Arial";
       ctx.textAlign = "left";

       const legendX = 400 - 85;
       let legendY = 250 / 2 - 20;  // adjusted to match new pie chart position

       legend.forEach((item, i) => {
           // Color square
           ctx.fillStyle = item.color;
           ctx.fillRect(legendX, legendY + i * 26, 12, 12);

           // Text
           ctx.fillStyle = "#333";
           ctx.fillText(item.label, legendX + 18, legendY + i * 26 + 10);
       });
   }
   

   // ------------------------
   // GENERATE KEY INSIGHTS
   // ------------------------
   function generateKeyInsights(entries) {
       const insightsContainer = document.getElementById('keyInsights');
       if (!insightsContainer) return;
       insightsContainer.innerHTML = '';

       entries.forEach(entry => {
           const div = document.createElement('div');
           div.style.marginBottom = '10px';
           div.innerHTML = `<strong>Day ${entry.day}:</strong> ${entry.sentiment.label} (${(entry.sentiment.score * 100).toFixed(0)}%)`;
           insightsContainer.appendChild(div);
       });
   }

   // ------------------------
   // INITIALIZE CALENDAR ON PAGE LOAD
   // ------------------------
   initializeCalendar();

});