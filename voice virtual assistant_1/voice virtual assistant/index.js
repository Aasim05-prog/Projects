const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(sentence) {
  const text_speak = new SpeechSynthesisUtterance(sentence);
  text_speak.rate = 1;
  text_speak.pitch = 1;
  text_speak.lang = "en-GB";
  window.speechSynthesis.speak(text_speak);
}

function wishMe() {
  var day = new Date();
  var hr = day.getHours();

  if (hr >= 0 && hr < 12) {
    speak("Good Morning sir");
  } else if (hr == 12) {
    speak("Good noon sir");
  } else if (hr > 12 && hr <= 17) {
    speak("Good Afternoon sir");
  } else if (hr > 17 && hr <= 19) {
    speak("Good Evening sir");
  } else {
    speak("Good night sir");
  }
}

window.addEventListener('load', () => {
  speak("Activating Eva");
  speak("Going online");
  wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const current = event.resultIndex;
  const transcript = event.results[current][0].transcript;
  content.textContent = transcript;
  speakThis(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
  content.textContent = "Listening...";
  recognition.start();
});

recognition.onend = () => {
  content.textContent = "Click here to talk to me";
};

recognition.onerror = (event) => {
  content.textContent = "Sorry, I didn't catch that. Please try again.";
  speak("Sorry, I didn't catch that. Please try again.");
  console.error("Speech Recognition Error:", event.error);
};

function evaluateExpression(expression) {
  try {
    return eval(expression);
  } catch (error) {
    return "I couldn't understand the math expression.";
  }
}

async function speakThis(message) {
  const speech = new SpeechSynthesisUtterance();
  speech.volume = 1;
  speech.pitch = 1;
  speech.rate = 1;
  speech.lang = "en-GB";
  speech.text = "I did not understand what you said, please try again.";

  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = voices.find(voice => voice.name.toLowerCase().includes('female'));

  if (!selectedVoice) {
    selectedVoice = voices.find(voice => voice.lang === 'en-GB');
  }

  speech.voice = selectedVoice;

  if (message.includes('sleep') || message.includes('shutdown')) {
    speech.text = "Shutting down the system. Goodbye.";
    window.speechSynthesis.speak(speech);
    setTimeout(() => {
      shutdownSystem();
    }, 2000);
    return;
  }

  if (message.includes('time')) {
    const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
    speech.text = `The time is ${time}.`;
  } else if (message.includes('date')) {
    const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric" });
    speech.text = `Today's date is ${date}.`;

  } else if (message.match(/^\d+\s*[\+\-\*\/]\s*\d+/)) {
    const result = evaluateExpression(message);
    speech.text = `The result is ${result}.`;

  } else if (message.includes('hey') || message.includes('hello')) {
    speech.text = "Hello sir";
  } else if (message.includes('how are you')) {
    speech.text = "I am fine, sir. Tell me how I can help you.";
  } else if (message.includes('what is your name')) {
    speech.text = "My name is Eva.";
  } else if (message.includes('tell me a joke')) {
    await tellJoke();
    speech.text = "Here is a joke for you.";

  } else if (message.includes('open mail')) {
    window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");
    speech.text = "Opening Gmail.";
  } else if (message.includes('how was today weather')) {
    window.open("https://accuweather.com/", "_blank");
    speech.text = "Fetching the weather forecast.";
  } else if (message.includes('open google')) {
    window.open("https://google.com", "_blank");
    speech.text = "Opening Google.";
  } else if (message.includes('open instagram')) {
    window.open("https://instagram.com", "_blank");
    speech.text = "Opening Instagram.";
  } else if (message.includes('open wikipedia')) {
    window.open("https://en.wikipedia.org", "_blank");
    speech.text = "Opening Wikipedia.";
  } else if (message.includes('open youtube')) {
    window.open("https://youtube.com", "_blank");
    speech.text = "Opening youtube.";
  } else if (message.includes('open spotify')) {
    window.open("https://spotify.com", "_blank");
    speech.text = "Opening spotify.";
  } else if (message.includes('open classroom')) {
    window.open("https://classroom.google.com", "_blank");
    speech.text = "Opening Google Classroom.";
  } else if (message.includes('open ai')) {
    window.open("https://chat.openai.com", "_blank");
    speech.text = "Opening AI ChatGPT.";
  } else if (message.includes('google')) {
    let query = message.replace("google", "").trim();
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    speech.text = "This is what I found on Google for " + query + ".";
  } else if (message.includes('wikipedia')) {
    let query = message.replace("wikipedia", "").trim();
    window.open(`https://en.wikipedia.org/wiki/Special:Search/${encodeURIComponent(query)}`, "_blank");
    speech.text = "This is what I found on Wikipedia for " + query + ".";
  } else if (message.includes('spotify')) {
    let songQuery = message.replace("spotify", "").trim();
    window.open(`https://open.spotify.com/search/${encodeURIComponent(songQuery)}`, "_blank");
    speech.text = "This is what I found on Spotify for the song " + songQuery + ".";
  } else if (message.includes('youtube')) {
    let videoQuery = message.replace("youtube", "").trim();
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(videoQuery)}`, "_blank");
    speech.text = "This is what I found on YouTube for " + videoQuery + ".";
  } else {
    window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
    speech.text = "I found some information for " + message + " on Google.";
  }

  window.speechSynthesis.speak(speech);
}

function parseAlarmTime(timeString) {
  const date = new Date();
  const timeParts = timeString.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/);

  if (timeParts) {
    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const period = timeParts[3];

    if (period) {
      if (period.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
      } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }
    }

    date.setHours(hours, minutes, 0, 0);
    return date;
  } else {
    return null;
  }
}

function shutdownSystem() {
  if (confirm("Are you sure you want to shut down the system?")) {
    window.location.href = "about:blank";
  }
}

async function tellJoke() {
  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything.",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why did the scarecrow win an award? Because he was outstanding in his field.",
    "Why don't skeletons fight each other? They don't have the guts.",
    "What do you call fake spaghetti? An impasta.",
    "Why did the bicycle fall over? Because it was two-tired.",
    "What do you call cheese that isn't yours? Nacho cheese.",
    "Why couldn't the leopard play hide and seek? Because he was always spotted.",
    "What do you get when you cross a snowman and a vampire? Frostbite.",
    "Why did the math book look sad? Because it had too many problems.",
    "Why was the stadium so cool? Because it was filled with fans.",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
    "Why don't some couples go to the gym? Because some relationships don't work out.",
    "I would tell you a construction joke, but I'm still working on it.",
    "Why did the tomato turn red? Because it saw the salad dressing.",
    "Why did the computer go to the doctor? Because it had a virus.",
    "Why was the broom late? It swept in.",
    "Why don't oysters donate to charity? Because they are shellfish.",
    "Why did the coffee file a police report? It got mugged.",
    "Why did the cookie go to the hospital? Because it felt crummy.",
    "Why was the big cat disqualified from the race? Because it was a cheetah."
  ];

  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  speak(randomJoke);
}
