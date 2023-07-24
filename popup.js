document.addEventListener("DOMContentLoaded", function () {
  const ul = document.getElementById("key-words");
  if (!localStorage["linkedin_job_ats_checker_keywords"]) {
    localStorage.setItem(
      "linkedin_job_ats_checker_keywords",
      JSON.stringify([])
    );
  } else {
    let keywords = JSON.parse(
      localStorage["linkedin_job_ats_checker_keywords"]
    );

    keywords.forEach((keyword) => {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(keyword));
      li.classList.add("keyword_item");
      var removeButton = document.createElement("button");
      removeButton.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i>`;
      removeButton.classList.add("btnRemove");
      removeButton.addEventListener("click", function () {
        ul.removeChild(li);
        let newKeywordsArr = JSON.parse(
          localStorage["linkedin_job_ats_checker_keywords"]
        );
        newKeywordsArr = newKeywordsArr.filter(
          (item) => item !== li.textContent
        );
        localStorage["linkedin_job_ats_checker_keywords"] =
          JSON.stringify(newKeywordsArr);
      });
      li.appendChild(removeButton);
      ul.appendChild(li);
    });
  }

  var form = document.getElementById("frm-keywords");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = document.getElementById("new-key-word");
    const li = document.createElement("li");
    if (input.value === "") return;
    li.appendChild(document.createTextNode(input.value));
    li.classList.add("keyword_item");
    let newKeywordsArr = JSON.parse(
      localStorage["linkedin_job_ats_checker_keywords"]
    );
    newKeywordsArr.push(input.value);
    localStorage["linkedin_job_ats_checker_keywords"] =
      JSON.stringify(newKeywordsArr);
    input.value = "";
    var removeButton = document.createElement("button");
    removeButton.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i>`;
    removeButton.classList.add("btnRemove");
    removeButton.addEventListener("click", function () {
      ul.removeChild(li);
      let newKeywordsArr = JSON.parse(
        localStorage["linkedin_job_ats_checker_keywords"]
      );
      newKeywordsArr = newKeywordsArr.filter((item) => item !== li.textContent);
      localStorage["linkedin_job_ats_checker_keywords"] =
        JSON.stringify(newKeywordsArr);
    });
    li.appendChild(removeButton);
    ul.appendChild(li);
  });

  let btnCheck = document.getElementById("btnCheck");
  btnCheck.addEventListener("click", function () {
    let keywords = Array.from(ul.children);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => {
            let jd = document
              .querySelector("div.job-view-layout")
              .textContent.toLowerCase();
            return jd;
          },
        },
        (result) => {
          let jd = JSON.stringify(result);
          if (jd) {
            let count = 0;
            keywords.forEach((li) => {
              if (jd.includes(li.textContent.toLowerCase())) {
                li.classList.add("found");
                count++;
              } else {
                li.classList.remove("found");
              }
            });
            if (count == 0) {
              let message = document.querySelector(".message");
              message.innerHTML = " ";
              setTimeout(() => {
                message.innerHTML = "No keyword found";
              }, 100);
            } else {
              let message = document.querySelector(".message");
              message.innerHTML = " ";
              setTimeout(() => {
                message.innerHTML = `${count} keyword${
                  count == 1 ? "" : "s"
                } found`;
              }, 100);
            }
          } else {
            let message = document.querySelector(".message");
            message.innerHTML = " ";
            setTimeout(() => {
              message.innerHTML = "This page does not contain a linkedin job";
            }, 100);
          }
        }
      );
    });
  });
});
