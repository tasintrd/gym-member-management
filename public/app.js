const API_URL = "/api/members";
const modalElement = document.getElementById("memberModal");
const memberModal = new bootstrap.Modal(modalElement);
const form = document.getElementById("memberForm");
const tableBody = document.getElementById("memberTable");
const searchInput = document.getElementById("searchInput");
let allMembers = [];

document.addEventListener("DOMContentLoaded", loadMembers);

document.getElementById("addMemberBtn").addEventListener("click", () => {
  resetForm();
  document.getElementById("modalTitle").textContent = "Add New Member";
  memberModal.show();
});

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase().trim();
  const filtered = allMembers.filter(member =>
    [member.name, member.email, member.phone].some(value =>
      String(value).toLowerCase().includes(term)
    )
  );
  renderMembers(filtered);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = document.getElementById("memberId").value;
  const member = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    membership_type: document.getElementById("membership_type").value,
    join_date: document.getElementById("join_date").value,
    status: document.getElementById("status").value
  };

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member)
    });
    const result = await response.json();

    if (!response.ok) {
      document.getElementById("formMessage").textContent = result.message || "Something went wrong.";
      return;
    }

    memberModal.hide();
    showToast(result.message);
    await loadMembers();
  } catch (error) {
    document.getElementById("formMessage").textContent = "Cannot connect to the server.";
  }
});

async function loadMembers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Request failed");
    allMembers = await response.json();
    updateStats();
    const term = searchInput.value.toLowerCase().trim();
    const filtered = allMembers.filter(member =>
      [member.name, member.email, member.phone].some(value =>
        String(value).toLowerCase().includes(term)
      )
    );
    renderMembers(filtered);
  } catch (error) {
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger py-4">Could not load members. Check the server and database connection.</td></tr>';
  }
}

function renderMembers(members) {
  if (!members.length) {
    tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-secondary py-4">No members found.</td></tr>';
    return;
  }

  tableBody.innerHTML = members.map(member => `
    <tr>
      <td class="text-secondary">#${member.id}</td>
      <td>
        <div class="member-name">${escapeHTML(member.name)}</div>
        <div class="member-email">${escapeHTML(member.email)}</div>
      </td>
      <td>${escapeHTML(member.phone)}</td>
      <td>${escapeHTML(member.membership_type)}</td>
      <td>${formatDate(member.join_date)}</td>
      <td><span class="status-pill ${member.status === "Active" ? "status-active" : "status-inactive"}">${escapeHTML(member.status)}</span></td>
      <td class="text-end">
        <button class="action-btn edit-btn" onclick="editMember(${member.id})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteMember(${member.id})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function updateStats() {
  document.getElementById("totalCount").textContent = allMembers.length;
  document.getElementById("activeCount").textContent = allMembers.filter(m => m.status === "Active").length;
  document.getElementById("inactiveCount").textContent = allMembers.filter(m => m.status === "Inactive").length;
}

function editMember(id) {
  const member = allMembers.find(item => item.id === id);
  if (!member) return;

  document.getElementById("memberId").value = member.id;
  document.getElementById("name").value = member.name;
  document.getElementById("email").value = member.email;
  document.getElementById("phone").value = member.phone;
  document.getElementById("membership_type").value = member.membership_type;
  document.getElementById("join_date").value = String(member.join_date).slice(0, 10);
  document.getElementById("status").value = member.status;
  document.getElementById("modalTitle").textContent = "Update Member";
  document.getElementById("formMessage").textContent = "";
  memberModal.show();
}

async function deleteMember(id) {
  const member = allMembers.find(item => item.id === id);
  if (!member || !confirm(`Delete ${member.name} from the member list?`)) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    showToast(result.message);
    await loadMembers();
  } catch (error) {
    showToast(error.message || "Could not delete member.");
  }
}

function resetForm() {
  form.reset();
  document.getElementById("memberId").value = "";
  document.getElementById("join_date").value = new Date().toISOString().slice(0, 10);
  document.getElementById("status").value = "Active";
  document.getElementById("formMessage").textContent = "";
}

function showToast(message) {
  document.getElementById("toastMessage").textContent = message;
  bootstrap.Toast.getOrCreateInstance(document.getElementById("appToast")).show();
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}
