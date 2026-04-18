const { data: sessionData } = await supabase.auth.getSession();

let user = sessionData.session?.user || null;
if (user) {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("appPage").style.display = "block";
}
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://kngeswiofipitijenvoo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2Vzd2lvZmlwaXRpamVudm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzU3NTcsImV4cCI6MjA5MjExMTc1N30.cBTH3m7c2LRKsi4lJuPMHrxMnoBnCh63K83K2ffES30"
);

let user = null;

// 🔐 LOGIN (FIXED)
window.login = async () => {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Enter email first");
    return;
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.href
    }
  });

  if (error) {
    alert(error.message);
    console.log(error);
  } else {
    document.getElementById("status").innerText =
      "Check your email inbox 📩 (and spam folder)";
  }
};

// 🔄 SESSION CHECK (AUTO LOGIN)
supabase.auth.onAuthStateChange((event, session) => {
  user = session?.user || null;

  if (user) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";
  } else {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("appPage").style.display = "none";
  }
});


// 🚪 LOGOUT
window.logout = async () => {
  await supabase.auth.signOut();
  location.reload();
};

// ➕ ADD SLOT
window.addSlot = async () => {
  if (!user) return alert("Login first");

  await supabase.from("slots").insert([{
    name: name.value,
    current: current.value.toLowerCase(),
    desired: desired.value.toLowerCase(),
    phone: phone.value,
    price: price.value || "Negotiable",
    user_id: user.id
  }]);

  loadSlots();
};

// 🔁 MATCH LOGIC
function isMatch(a, b) {
  return a.current === b.desired && a.desired === b.current;
}

// 📥 LOAD
window.loadSlots = async () => {
  let { data } = await supabase.from("slots").select("*");

  const search = document.getElementById("search").value?.toLowerCase();
  const list = document.getElementById("list");

  list.innerHTML = "";

  data.forEach(item => {
    if (search && !item.current.includes(search) && !item.desired.includes(search)) return;

    let matched = data.some(o => o.id !== item.id && isMatch(item, o));

    let contact = "🔒 Locked";

    if (matched) {
      const phone = item.phone.replace(/^0/, "254");
      contact = `<a href="https://wa.me/${phone}" target="_blank">
        <button>📱 WhatsApp</button>
      </a>`;
    }

    list.innerHTML += `
      <div class="card">
        <b>${item.name}</b>
        <p>${item.current} → ${item.desired}</p>
        <p>${item.price}</p>
        ${contact}
      </div>
    `;
  });
};
