const reviews = [
  {
    text: "The loan approval process was incredibly smooth. Got my working capital loan approved in just 3 days.",
    name: "Rajesh Kumar",
    role: "Manufacturing Unit",
    amount: "₹25 Lakhs",
    img: "img_res/Rajesh_Kumar.png",
  },
  {
    text: "Excellent service! Used the term loan to expand my retail business. Very flexible repayment.",
    name: "Priya Sharma",
    role: "Retail Chain Owner",
    amount: "₹50 Lakhs",
    img: "img_res/Priya_Sharma.png",
  },
  {
    text: "Best decision for my startup growth. Equipment finance helped us scale quickly.",
    name: "Amit Patel",
    role: "Tech Startup Founder",
    amount: "₹1.2 Crores",
    img: "img_res/Amit_Patel.png",
  },
  {
    text: "Transparent process with no hidden charges. Funds arrived exactly when needed.",
    name: "Vikram Singh",
    role: "Construction Company",
    amount: "₹80 Lakhs",
    img: "img_res/Vikram_Singh.png"
  }
];

const slider = document.getElementById("slider");
const dots = document.getElementById("dots");

let index = 0;

function getVisible() {
  return window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;
}

function getCardWidth() {
  const firstCard = slider.querySelector(".card");
  if (!firstCard) return 340;
  const style = getComputedStyle(firstCard);
  const width = parseInt(style.minWidth || style.width) || 340;
  const gap = 25;
  return width + gap;
}

function render() {
  const visible = getVisible();
  const dotsTotal = Math.ceil(reviews.length / visible);
  if (index >= dotsTotal) index = dotsTotal - 1;
  if (index < 0) index = 0;

  slider.innerHTML = "";
  dots.innerHTML = "";

  for (let i = 0; i < reviews.length; i++) {
    slider.innerHTML += `
      <div class="card">
        <div class="stars">★★★★★</div>
        <p class="review">"${reviews[i].text}"</p>
        <div class="user">
          <img src="${reviews[i].img}">
          <div>
            <h4>${reviews[i].name}</h4>
            <span>${reviews[i].role}</span><br>
            <span class="amount">${reviews[i].amount}</span>
          </div>
        </div>
      </div>
    `;
  }

  for (let i = 0; i < dotsTotal; i++) {
    dots.innerHTML += `<span class="${i === index ? "active" : ""}"></span>`;
  }

  const cardWidth = getCardWidth();
  slider.style.transform = `translateX(-${index * cardWidth * visible}px)`;
}

document.querySelector(".next").onclick = () => {
  const visible = getVisible();
  const total = Math.ceil(reviews.length / visible);
  index = (index + 1) % total;
  render();
};

document.querySelector(".prev").onclick = () => {
  const visible = getVisible();
  const total = Math.ceil(reviews.length / visible);
  index = (index - 1 + total) % total;
  render();
};

window.addEventListener("resize", render);
render();
