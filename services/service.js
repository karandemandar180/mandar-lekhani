"use strict";

const serviceData = {
  "article-writing": {
    title: "Article Writing",
    mr: "लेख लेखन सेवा",
    intro: "वेबसाइट, ब्लॉग, मासिके, वर्तमानपत्रे आणि डिजिटल प्लॅटफॉर्मसाठी माहितीपूर्ण, वाचनीय आणि विषयाला अनुरूप लेखन.",
    what: "विषयाचा अभ्यास करून प्रस्तावना, मुख्य मुद्दे, उदाहरणे आणि निष्कर्ष अशा सुसंगत रचनेत लेख तयार केला जातो.",
    items: [
      "मराठी आणि इंग्रजी माहितीपूर्ण लेख",
      "ब्लॉग पोस्ट आणि विषयविशेष लेख",
      "शैक्षणिक व जनजागृतीपर लेख",
      "तंत्रज्ञान आणि सामाजिक विषयांवरील लेख",
      "SEO लक्षात घेऊन वेबसाइट लेखन"
    ],
    audience: "वेबसाइट मालक, विद्यार्थी, संस्था, प्रकाशक, ब्लॉगर्स आणि व्यवसाय."
  },
  "technical-content": {
    title: "Technical Content Writing",
    mr: "तांत्रिक विषयांवरील लेखन",
    intro: "तंत्रज्ञान, सॉफ्टवेअर, सायबर सुरक्षा, डिजिटल फॉरेन्सिक्स आणि व्यवसाय प्रणाली यांसारख्या विषयांचे स्पष्ट व समजण्यास सोपे लेखन.",
    what: "कठीण तांत्रिक संकल्पना सोप्या भाषेत समजावून सांगणारे दस्तऐवज, मार्गदर्शक आणि माहितीपर लेख तयार केले जातात.",
    items: [
      "Cyber Security आणि Cyber Awareness लेख",
      "Digital Forensics व Digital Evidence विषय",
      "Software व Application Documentation",
      "User Guides आणि How-to लेख",
      "ERP, BPMS आणि E-Governance विषयक लेखन"
    ],
    audience: "IT कंपन्या, प्रशिक्षण संस्था, विद्यार्थी, तंत्रज्ञान व्यवसाय आणि डिजिटल सेवा पुरवठादार."
  },
  "website-business-content": {
    title: "Website & Business Content",
    mr: "वेबसाइट आणि व्यवसायासाठी मजकूर",
    intro: "व्यवसायाची ओळख, सेवा, उत्पादन, ग्राहकांसाठी माहिती आणि वेबसाइटवरील विविध विभागांसाठी व्यावसायिक मजकूर.",
    what: "व्यवसायाची सेवा आणि ग्राहकांची गरज समजून Home, About, Services, FAQ आणि Contact विभागांसाठी मजकूर तयार केला जातो.",
    items: [
      "Home Page आणि About Us मजकूर",
      "Services आणि Product Descriptions",
      "Business Profile व Company Introduction",
      "FAQ आणि ग्राहक मार्गदर्शन",
      "Landing Page व माहितीपत्रक मजकूर"
    ],
    audience: "लघु-मध्यम व्यवसाय, स्टार्टअप्स, व्यावसायिक, सल्लागार आणि सेवा पुरवठादार."
  },
  "cyber-law-content": {
    title: "Cyber Law Content",
    mr: "सायबर कायदा विषयक लेखन",
    intro: "सायबर कायदा, ऑनलाइन फसवणूक, डिजिटल पुरावे, गोपनीयता आणि सायबर जागरूकता यांवरील माहितीपूर्ण लेखन.",
    what: "कायदेशीर व तांत्रिक संकल्पना सामान्य वाचकांना समजतील अशा पद्धतीने मांडल्या जातात. लागू कायद्यांचा संदर्भ विषयानुसार तपासून समाविष्ट केला जातो.",
    items: [
      "Cyber Law Awareness Articles",
      "Online Fraud व Cyber Crime माहिती",
      "Digital Evidence व Chain of Custody विषय",
      "Privacy व Data Protection जागरूकता",
      "शैक्षणिक नोट्स व माहितीपर लेख"
    ],
    audience: "शैक्षणिक संस्था, विद्यार्थी, व्यावसायिक, संस्था आणि जनजागृती उपक्रम.",
    note: "ही लेखन व माहिती-जागरूकता सेवा आहे. वैयक्तिक प्रकरणातील कायदेशीर मत किंवा न्यायालयीन प्रतिनिधित्व याची हमी नाही."
  },
  "social-media-content": {
    title: "Social Media Content",
    mr: "सोशल मीडिया मजकूर लेखन",
    intro: "Facebook, Instagram, LinkedIn आणि WhatsApp साठी संक्षिप्त, लक्षवेधी आणि उद्दिष्टानुसार मजकूर.",
    what: "ब्रँड, सेवा, पुस्तक, कार्यक्रम किंवा जनजागृती मोहिमेचा उद्देश लक्षात घेऊन पोस्ट, कॅप्शन आणि प्रचार मजकूर तयार केला जातो.",
    items: [
      "Social Media Posts आणि Captions",
      "LinkedIn Professional Posts",
      "WhatsApp Status व Promotional Text",
      "Book आणि Product Promotion",
      "Awareness Campaign Content"
    ],
    audience: "लेखक, प्रकाशक, व्यावसायिक, संस्था, उद्योजक आणि सामाजिक उपक्रम."
  },
  "book-editorial-support": {
    title: "Book & Editorial Support",
    mr: "पुस्तक आणि संपादकीय सहाय्य",
    intro: "पुस्तकाची संकल्पना, प्रकरणांची मांडणी, भाषिक सुधारणा आणि प्रकाशनासाठी आवश्यक मजकूर याबाबत सहाय्य.",
    what: "लेखकाच्या मूळ विचारांचा आणि लेखनशैलीचा आदर राखून रचना, वाचनसुलभता आणि भाषिक सुसंगती सुधारण्यावर भर दिला जातो.",
    items: [
      "Book Description आणि Author Bio",
      "Chapter Structure व Content Planning",
      "भाषिक संपादन व Proofreading",
      "प्रस्तावना आणि पुस्तक परिचय मसुदा",
      "E-book व पुस्तक प्रचार मजकूर"
    ],
    audience: "नवोदित लेखक, स्वतंत्र लेखक, प्रकाशक आणि ई-बुक निर्माते."
  }
};

const key = document.body.dataset.service;
const data = serviceData[key];
const root = document.getElementById("service-content");

if (root && data) {
  const make = (tag, text, parent) => {
    const el = document.createElement(tag);
    el.textContent = text;
    parent.appendChild(el);
    return el;
  };

  make("div", data.mr, root);
  make("h1", data.title, root);
  make("p", data.intro, root);

  const main = document.createElement("main");
  main.className = "container";

  const panel1 = document.createElement("section");
  panel1.className = "panel";
  make("h2", "ही सेवा काय आहे?", panel1);
  make("p", data.what, panel1);
  main.appendChild(panel1);

  const panel2 = document.createElement("section");
  panel2.className = "panel";
  make("h2", "या सेवेमध्ये काय समाविष्ट आहे?", panel2);
  const ul = document.createElement("ul");
  data.items.forEach(item => make("li", item, ul));
  panel2.appendChild(ul);
  main.appendChild(panel2);

  const panel3 = document.createElement("section");
  panel3.className = "panel";
  make("h2", "कोणासाठी उपयुक्त?", panel3);
  make("p", data.audience, panel3);
  if (data.note) make("p", data.note, panel3);
  main.appendChild(panel3);

  const panel4 = document.createElement("section");
  panel4.className = "panel";
  make("h2", "कामाची प्रक्रिया", panel4);
  make("p", "१. तुमचा विषय आणि उद्देश समजून घेणे. २. आवश्यक भाषा, शब्दमर्यादा आणि अंतिम तारीख निश्चित करणे. ३. लेखनाचा मसुदा तयार करणे. ४. तुमच्या अभिप्रायानुसार मान्य सुधारणा करणे. ५. अंतिम मजकूर देणे.", panel4);
  make("p", "काम सुरू करण्यापूर्वी व्याप्ती, वेळ आणि शुल्क परस्पर संमतीने निश्चित केले जाईल.", panel4);
  main.appendChild(panel4);

  const panel5 = document.createElement("section");
  panel5.className = "panel";
  make("h2", "चौकशी / Enquiry", panel5);
  make("p", "तुमच्या गरजेनुसार सेवा आणि उपलब्धता जाणून घेण्यासाठी WhatsApp वर संपर्क करा.", panel5);

  const link = document.createElement("a");
  link.className = "btn alt";
  link.href = "https://wa.me/918275593749?text=" +
    encodeURIComponent("नमस्कार, मला " + data.title + " सेवेसाठी माहिती आणि कोटेशन हवे आहे.");
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "WhatsApp Enquiry";
  panel5.appendChild(link);

  const back = document.createElement("a");
  back.className = "btn";
  back.href = "../index.html#content-writing";
  back.textContent = "मुख्य वेबसाइटवर परत जा";
  panel5.appendChild(back);

  main.appendChild(panel5);
  root.appendChild(main);
} else if (root) {
  makeError();
}

function makeError() {
  root.textContent = "सेवेची माहिती उपलब्ध नाही. कृपया मुख्य वेबसाइटवर परत जा.";
}
