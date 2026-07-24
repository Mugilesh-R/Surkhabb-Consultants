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
    img: "img_res/Rajesh_Kumar.png"
  }
];

const slider = document.getElementById("slider");
const dots = document.getElementById("dots");

let index = 0;
const visible = 3;

function render() {
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

  for (let i = 0; i < reviews.length / visible; i++) {
    dots.innerHTML += `<span class="${i === index ? "active" : ""}"></span>`;
  }

  slider.style.transform = `translateX(-${index * (360 + 25) * visible}px)`;
}

document.querySelector(".next").onclick = () => {
  index = (index + 1) % Math.ceil(reviews.length / visible);
  render();
};

document.querySelector(".prev").onclick = () => {
  index = (index - 1 + Math.ceil(reviews.length / visible)) % Math.ceil(reviews.length / visible);
  render();
};

render();
