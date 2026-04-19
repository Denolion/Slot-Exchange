import { createClient } import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔐 Supabase setup
const supabaseUrl = "https://kngeswiofipitijenvoo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuZ2Vzd2lvZmlwaXRpamVudm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzU3NTcsImV4cCI6MjA5MjExMTc1N30.cBTH3m7c2LRKsi4lJuPMHrxMnoBnCh63K83K2ffES30";

const supabase = createClient(supabaseUrl, supabaseKey);

// 👤 Current user
let user = null;

/* =========================
   🔄 AUTH STATE HANDLER
========================= */
supabase.auth.onAuthStateChange((event, session) => {
  user = session?.user || null;

  if (user) {
    showApp();
  } else {
    showLogin();
  }
});

/* =========================
   🚀 CHECK SESSION ON LOAD
========================= */
window.addEventListener("load", async () => {
  const { data } = await supabase.auth.getSession();

  user = data.session?.user || null;

  if (user) {
    showApp();
  } else {
    showLogin();
  }

  loadSlots();
});

/* =========================
   🔐 LOGIN (EMAIL OTP)
========================= */
window.login = async () => {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Please enter email");
    return;
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "https://denolion.github.io/Slot-Exchange"
    }
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Check your email inbox 📩");
  }
};

/* =========================
   🚪 LOGOUT
========================= */
window.logout = async () => {
  await supabase.auth.signOut();
  location.reload();
};

/* =========================
   ➕ ADD SLOT
========================= */
window.addSlot = async () => {
  if (!user) {
    alert("Login required");
    return;
  }

  const { error } = await supabase.from("slots").insert([
    {
      name: name.value,
      current: current.value.toLowerCase(),
      desired: desired.value.toLowerCase(),
      phone: phone.value,
      price: price.value || "Negotiable",
      user_id: user.id
    }
  ]);

  if (error) {
    alert(error.message);
  } else {
    loadSlots();
  }
};

/* =========================
   📥 LOAD SLOTS
========================= */
async function loadSlots() {
  const { data, error } = await supabase.from("slots").select("*");

  if (error) {
    console.log(error);
    return;
  }

  const list = document.getElementById("list");
  const search = document.getElementById("search")?.value?.toLowerCase() || "";

  list.innerHTML = "";

  data.forEach(item => {
    if (
      search &&
      !item.current.includes(search) &&
      !item.desired.includes(search)
    ) return;

    const match = data.some(
      o =>
        o.id !== item.id &&
        o.current === item.desired &&
        o.desired === item.current
    );

    let contact = "🔒 Locked";

    if (match) {
      const phone = item.phone?.replace(/^0/, "254");

      contact = `
        <a href="https://wa.me/${phone}" target="_blank">
          <button>📱 WhatsApp</button>
        </a>
      `;
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
}

window.loadSlots = loadSlots;

/* =========================
   🎭 UI HELPERS
========================= */
function showApp() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("appPage").style.display = "block";
}

function showLogin() {
  document.getElementById("loginPage").style.display = "block";
  document.getElementById("appPage").style.display = "none";
}￼Enter
