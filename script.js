const socket = io("https://whispering-chamber-09886.herokuapp.com");
// const socket = io("http://localhost:3000");

const messageListe = document.querySelector(".message-liste");
const usersListe = document.querySelector(".users-liste");
const formSendMessage = document.querySelector(".form_send-message");
const formRename = document.querySelector(".form_rename");
const btnRename = document.querySelector(".button_rename");
const sectionUsers = document.querySelector(".section_users");
const section_chat = document.querySelector(".section_chat");
const button_chat = document.querySelector(".button_chat");
let socketId;

// Ecoute la connection
socket.on("connect", () => {
  socketId = socket.id;
});

socket.on("users", (users) => {
  let j = 0;

  for (const user of users) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.innerHTML = user.name;
    let i = document.createElement("i");
    i.classList.add("fa-regular", "fa-heart");
    i.addEventListener("click", handleChangeLike);
    li.appendChild(p);
    li.appendChild(i);
    usersListe.appendChild(li);

    j++;
    if (j > 40) break;
  }
});

const handleChangeLike = (e) => {
  e.target.classList.toggle("fa-regular");
  e.target.classList.toggle("fa-solid");
};

formRename.addEventListener("submit", (e) => {
  e.preventDefault();
  btnRename.click();
});

const inputRename = formRename.querySelector("input");

inputRename.addEventListener("input", (e) => {
  if (e.target.value.trim().length > 2) {
    btnRename.disabled = false;
  } else {
    btnRename.disabled = true;
  }
});

// Envoie le nom de l'utilisateur
btnRename.addEventListener("click", () => {
  const value = inputRename.value;

  inputRename.value = "";
  // Demande la liste des utilisateurs
  socket.emit("setUsername", value);
  socket.emit("getUsers");
  sectionUsers.classList.add("active");
});

// Section des utilisateurs

const btnretourToHome = document.querySelector(".retourToHome");
const texteBtnRetourToHome = btnretourToHome.querySelector("span");

btnretourToHome.addEventListener("click", () => {
  sectionUsers.classList.remove("active");
});

const cover = document.querySelector(".cover");
const containerSectionUsers = sectionUsers.querySelector(".container");
const bgSectionUsers = sectionUsers.querySelector(".bg");

containerSectionUsers.addEventListener("scroll", () => {
  texteBtnRetourToHome.style.opacity =
    1 - containerSectionUsers.scrollTop / 100;

  cover.style.opacity = 1 - containerSectionUsers.scrollTop / 200;
  cover.style.transform = `scale(${
    1 - containerSectionUsers.scrollTop / 1000
  }) translateY(${containerSectionUsers.scrollTop / 2}px)`;

  if (containerSectionUsers.scrollTop < 330) {
    bgSectionUsers.style.opacity = 0.3 + containerSectionUsers.scrollTop / 500;
    bgSectionUsers.style.height = `${
      350 - containerSectionUsers.scrollTop / 4
    }px`;
    bgSectionUsers.style.transform = `translateY(-${
      containerSectionUsers.scrollTop / 3
    }px)`;
  }
});

// Ecoute la reception de l'historique des messages
socket.on("messages", (messages) => {
  let i = 0;

  for (let j = messages.length - 30; j < messages.length; j++) {
    addMessage(messages[j]);
    i++;
    if (i > 29) break;
  }
});

button_chat.addEventListener("click", () => {
  // Demande l'historique des messages
  socket.emit("getMessages");
  section_chat.classList.add("active");
  changeVideo(0);
});

// Section chat

const playlist = [
  {
    name: "Bad Guy",
    artist: "Billie Eilish",
    cover: "badguy.jpg",
    src: "BillieEilish-badguy.mp4",
  },
  {
    name: "God Is A Woman",
    artist: "Ariana Grande",
    cover: "godisawoman.jpeg",
    src: "GodisAWoman.mp4",
  },
  {
    name: "How Do You Sleep",
    artist: "Sam Smith",
    cover: "howdoyousleep.png",
    src: "SamSmith-HowDoYouSleep.mp4",
  },
  {
    name: "Hate me",
    artist: "Ellie Goulding",
    cover: "hateme.jpg",
    src: "EllieGouldingJuiceWRLD-HateMe.mp4",
  },
];

// Video
const video = document.querySelector(".video");
const playpause = document.querySelector("#playpause");
document.createElement("progress").max !== undefined;

playpause.addEventListener("click", () => {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
});

const progress = document.querySelector("#progress");

progress.addEventListener("click", (e) => {
  let pos = (e.pageX - progress.offsetLeft) / progress.offsetWidth;
  pos = pos - 0.055;
  progress.value = pos * 100;
  video.currentTime = pos * video.duration;
  video.play();
});

// set proagress bar value on video timeupdate
video.addEventListener("timeupdate", () => {
  if (video.currentTime > 0) {
    progress.value = (video.currentTime / video.duration) * 100;
  }
});

const previous = document.querySelector(".previous");
const next = document.querySelector(".next");

const sourceVideo = video.querySelector("source");
let indexPlaylist = 0;

video.addEventListener("ended", () => {
  previous.click();
});

previous.addEventListener("click", () => {
  if (indexPlaylist === 0) {
    indexPlaylist = playlist.length - 1;
  } else {
    indexPlaylist--;
  }
  changeVideo(indexPlaylist);
});

next.addEventListener("click", () => {
  if (indexPlaylist === playlist.length - 1) {
    indexPlaylist = 0;
  } else {
    indexPlaylist++;
  }
  changeVideo(indexPlaylist);
});

const nameSon = document.querySelector(".controls .name");
const artistSon = document.querySelector(".controls .artiste");

const changeVideo = (index) => {
  sourceVideo.src = "./assets/videos/" + playlist[index].src;
  nameSon.innerHTML = playlist[index].name;
  artistSon.innerHTML = playlist[index].artist;
  video.load();
  video.play();
};

//on play video
video.addEventListener("play", () => {
  playpause.querySelector(".play").style.display = "none";
  playpause.querySelector(".pause").style.display = "block";
});

//on pause video
video.addEventListener("pause", () => {
  playpause.querySelector(".play").style.display = "block";
  playpause.querySelector(".pause").style.display = "none";
});

const btnOpenChat = document.querySelector(".btnOpenChat");
const btnCloseChat = document.querySelector(".btnCloseChat");
const container_chat = document.querySelector(".container_chat");
const videoControls = document.querySelector(".video-controls");
const btnRetourToUser = document.querySelector(".retourToUser");

btnRetourToUser.addEventListener("click", () => {
  section_chat.classList.remove("active");
});

btnOpenChat.addEventListener("click", () => {
  container_chat.classList.add("active");
  videoControls.classList.add("up");
  btnRetourToUser.classList.add("disabled");
});

btnCloseChat.addEventListener("click", () => {
  container_chat.classList.remove("active");
  videoControls.classList.remove("up");
  btnRetourToUser.classList.remove("disabled");
});

// Ecoute la réception d'un nouveau message
socket.on("message", (message) => {
  addMessage(message);
});

const inputMsg = formSendMessage.querySelector("input");

// Envoie d'un nouveau messageaddMessage
formSendMessage.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputMsg = formSendMessage.querySelector("input");
  const value = inputMsg.value;
  inputMsg.value = "";

  socket.emit("message", value);
});

// Ajout d'un message audio
const btnAudio = document.querySelector(".btn-audio");
btnAudio.addEventListener("click", () => {
  //if input is empty
  if (inputMsg.value === "") {
    const audio =
      '<audio controls src="./assets/file_example_MP3_700KB.mp3"></audio>';
    socket.emit("message", audio);
  }
});

const addMessage = (message) => {
  const li = document.createElement("li");

  if (message) {
    if (socketId === message.user.id) {
      li.classList.add("me");
    }

    // Msg et name
    const container_msg_name = document.createElement("p");
    const msg = document.createElement("span");
    msg.classList.add("msg");
    const name = document.createElement("span");
    name.classList.add("name");
    msg.innerHTML = message.value;
    name.innerHTML = message.user.name;
    container_msg_name.appendChild(name);
    container_msg_name.appendChild(msg);
    container_msg_name.classList.add("container_msg_name");

    // Date
    const date = document.createElement("p");
    date.classList.add("date");

    // Heure Ecmascript to French heure
    const date_heure = new Date(message.time);
    const heure = date_heure.getHours();
    const minute = date_heure.getMinutes();
    const formatHeure = (heure < 10 ? "0" : "") + heure;
    const formatMinute = (minute < 10 ? "0" : "") + minute;

    date.innerHTML = formatHeure + ":" + formatMinute;

    li.appendChild(container_msg_name);
    li.appendChild(date);

    messageListe.appendChild(li);
    messageListe.scrollTop = messageListe.scrollHeight;
  }
};
