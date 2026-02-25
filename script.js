const checkInForm = document.getElementById("checkInForm");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const attendeeList = document.getElementById("attendeeList");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

let totalAttendees = 0;
const maxAttendees = 50;
const teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};
const attendees = [];

const countStorageKey = "intelSummitCounts";
const attendeeStorageKey = "intelSummitAttendees";

loadSavedProgress();
updateDisplay();
renderAttendeeList();

function updateDisplay() {
  attendeeCount.textContent = totalAttendees;
  waterCount.textContent = teamCounts.water;
  zeroCount.textContent = teamCounts.zero;
  powerCount.textContent = teamCounts.power;

  const progressPercentage = (totalAttendees / maxAttendees) * 100;
  progressBar.style.width = `${Math.min(progressPercentage, 100)}%`;
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-attendees";
    emptyItem.textContent = "No attendees checked in yet.";
    attendeeList.appendChild(emptyItem);
    return;
  }

  for (let i = 0; i < attendees.length; i = i + 1) {
    const attendee = attendees[i];
    const attendeeItem = document.createElement("li");
    attendeeItem.className = "attendee-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "attendee-name";
    nameSpan.textContent = attendee.name;

    const teamSpan = document.createElement("span");
    teamSpan.className = "attendee-team";
    teamSpan.textContent = attendee.teamLabel;

    attendeeItem.appendChild(nameSpan);
    attendeeItem.appendChild(teamSpan);
    attendeeList.appendChild(attendeeItem);
  }
}

function saveProgress() {
  const countsData = {
    totalAttendees: totalAttendees,
    teamCounts: teamCounts,
  };

  localStorage.setItem(countStorageKey, JSON.stringify(countsData));
  localStorage.setItem(attendeeStorageKey, JSON.stringify(attendees));
}

function loadSavedProgress() {
  const savedCounts = localStorage.getItem(countStorageKey);
  const savedAttendees = localStorage.getItem(attendeeStorageKey);

  if (savedCounts) {
    const parsedCounts = JSON.parse(savedCounts);
    totalAttendees = parsedCounts.totalAttendees || 0;
    teamCounts.water = parsedCounts.teamCounts.water || 0;
    teamCounts.zero = parsedCounts.teamCounts.zero || 0;
    teamCounts.power = parsedCounts.teamCounts.power || 0;
  }

  if (savedAttendees) {
    const parsedAttendees = JSON.parse(savedAttendees);

    for (let i = 0; i < parsedAttendees.length; i = i + 1) {
      attendees.push(parsedAttendees[i]);
    }
  }
}

function getLeadingTeamLabel() {
  let leadingTeam = "water";
  let highestCount = teamCounts.water;

  if (teamCounts.zero > highestCount) {
    leadingTeam = "zero";
    highestCount = teamCounts.zero;
  }

  if (teamCounts.power > highestCount) {
    leadingTeam = "power";
  }

  if (leadingTeam === "water") {
    return "Team Water Wise";
  }

  if (leadingTeam === "zero") {
    return "Team Net Zero";
  }

  return "Team Renewables";
}

checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const attendeeNameInput = document.getElementById("attendeeName");
  const teamSelect = document.getElementById("teamSelect");

  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;
  const selectedTeamLabel = teamSelect.options[teamSelect.selectedIndex].text;
  totalAttendees = totalAttendees + 1;
  teamCounts[selectedTeam] = teamCounts[selectedTeam] + 1;
  attendees.push({
    name: attendeeName,
    teamLabel: selectedTeamLabel,
  });

  updateDisplay();
  renderAttendeeList();
  saveProgress();

  let greetingMessage = `Welcome, ${attendeeName}! You are checked in to ${selectedTeamLabel}.`;
  greeting.classList.remove("celebration-message");
  greeting.classList.add("success-message");

  if (totalAttendees >= maxAttendees) {
    const leadingTeamLabel = getLeadingTeamLabel();
    greetingMessage = `🎉 Goal reached! ${leadingTeamLabel} is currently leading the check-in challenge!`;
    greeting.classList.remove("success-message");
    greeting.classList.add("celebration-message");
  }

  greeting.textContent = greetingMessage;
  greeting.style.display = "block";

  checkInForm.reset();
});
