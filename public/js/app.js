
const form = document.getElementById("meetingForm");
const list = document.getElementById("meetingList");

form.onsubmit = async (e) => {
  e.preventDefault();
  const data = {
  userId: window.demoUserId,
  title: title.value,
  startTime: startTime.value,
  endTime: endTime.value
};

  const res = await fetch("/meetings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert((await res.json()).message || "Created");
  loadMeetings();
};

async function loadMeetings() {
  const res = await fetch("/meetings");
  const meetings = await res.json();
  list.innerHTML = meetings.map(m => `
  <li>
    <b>${m.title}</b> (${new Date(m.startTime).toLocaleString()})
    <button onclick="editMeeting('${m.id}')">Edit</button>
    <button onclick="deleteMeeting('${m.id}')">Delete</button>
  </li>
`).join("");
}

async function deleteMeeting(id) {
  await fetch(`/meetings/${id}`, { method: "DELETE" });
  loadMeetings();
}

async function editMeeting(id) {
  const newStart = prompt("Enter new start time (YYYY-MM-DDTHH:MM)");
  const newEnd = prompt("Enter new end time (YYYY-MM-DDTHH:MM)");

  if (!newStart || !newEnd) return;

  await fetch(`/meetings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      startTime: newStart,
      endTime: newEnd
    })
  });

  loadMeetings();
}



loadMeetings();
