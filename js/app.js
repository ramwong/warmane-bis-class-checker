const itemTable = document.getElementById("itemTable");
const inputItemName = document.getElementById("inputItemName");
const inputItemNameValue = inputItemName.value.toLowerCase();
const searchButton = document.getElementById("startSearch");
const selectClassList = document.getElementById("classSelect");
const selectSpecList = document.getElementById("specSelect");

let itemsList = data;
const tableClass =
  "table table-dark table-striped text-center table-bordered table-sm";

addOptionToSelectList = (value, selectList) => {
  const opt = document.createElement("option");
  opt.appendChild(document.createTextNode(value));
  opt.value = value;

  return selectList.appendChild(opt);
};

// Very interesting post about wow class colors
// https://chasechristian.com/blog/2015/08/the-history-of-wow-class-colors/
// Last colors is druid
classColor = (className) => {
  return className.match("Shaman")
    ? "2359FF"
    : className.match("薩滿")
    ? "2359FF"
    : className.match("Rogue")
    ? "FFF468"
    : className.match("盜賊")
    ? "FFF468"
    : className.match("Hunter")
    ? "AAD372"
    : className.match("獵人")
    ? "AAD372"
    : className.match("Priest")
    ? "F0EBE0"
    : className.match("牧師")
    ? "F0EBE0"
    : className.match("Warlock")
    ? "9382C9"
    : className.match("術士")
    ? "9382C9"
    : className.match("Warrior")
    ? "C69B6D"
    : className.match("戰士")
    ? "C69B6D"
    : className.match("Mage")
    ? "68CCEF"
    : className.match("法師")
    ? "68CCEF"
    : className.match("Death Knight")
    ? "C41E3B"
    : className.match("死亡騎士")
    ? "C41E3B"
    : className.match("Paladin")
    ? "F48CBA"
    : className.match("聖騎士")
    ? "F48CBA"
    : "FF7C0A";
};

addBisAsKey = (bisSlotName, bisForClasses, classAndSpecName, bisName) => {
  if (!(bisName in bisForClasses)) {
    return (bisForClasses[bisName] = {
      classAndSpecName: classAndSpecName,
      bisSlotName: bisSlotName,
    });
  } else {
    if (bisForClasses[bisName]["classAndSpecName"].match(classAndSpecName)) {
      return;
    }
    return (bisForClasses[bisName]["classAndSpecName"] += classAndSpecName);
  }
};

// const searchValue = "wotlk/";
// let replaceValue = "wotlk/cn/";
let language = "en";

const makeSortable = () => {
  for (let table of document.getElementsByClassName("sortable")) {
    sorttable.makeSortable(table);
  }
};

const languageList = document.getElementById("languages");
languageList.addEventListener("change", () => {
  language = languageList.value;
  if(language === "en"){
    //replaceValue = "wotlk/"
    itemsList = data;
  }else{
    //replaceValue = "wotlk/cn/"
    itemsList = data_zh;
  }
  
  initializeClassSelectList(itemsList);
  //.replaceAll(searchValue,replaceValue)
  if (currentE) {
    changeSelect(currentE);
  } else {
    rewriteHTMLTable(itemsList, inputItemNameValue);
  }
  adjustColumnHeight("nested-table");
  makeSortable();
});

rewriteHTMLTable = (data, inputValue) => {
  itemTable.innerHTML = "";
  const bisForClasses = {};

  let newTable = `
        <table class="${tableClass} sortable">
            <tr>
                <th>Item's Slot</th>
                <th>Item's Name</th>
                <th>From</th>
                <th>Type</th>
                <th>Classes</th>
            </tr>
            <tr>`;

  Object.keys(data).map((className) => {
    const classSpecValue = data[className];

    return Object.keys(classSpecValue).map((specName) => {
      const specBisList = classSpecValue[specName];

      return Object.keys(specBisList).map((bisSlotName) => {
        const bisName = specBisList[bisSlotName];
        const classAndSpecName = `<span style="color: #${classColor(
          className
        )}">${className + " " + specName}</span><br/>`;

        if (typeof bisName === "string") {
          bis = specBisList[bisSlotName];
          // if (language === "cn") {
          //   bis = bis.replaceAll(searchValue, replaceValue);
          // }
          if (bis === "-") {
            return;
          }
          return addBisAsKey(bisSlotName, bisForClasses, classAndSpecName, bis);
        } else {
          return bisName.map((key) => {
            // if (language === "cn") {
            //   key = key.replaceAll(searchValue, replaceValue);
            // }
            return addBisAsKey(
              bisSlotName,
              bisForClasses,
              classAndSpecName,
              key
            );
          });
        }
      });
    });
  });
  Object.keys(bisForClasses).map((key) => {
    const bisSlotName = bisForClasses[key]["bisSlotName"];
    if (
      inputValue === "" ||
      key.replaceAll("wowhead", "").toLowerCase().match(inputValue) ||
      bisSlotName.toLowerCase().match(inputValue)
    ) {
      return (newTable += `
                <tr>
                    <td align='center' class="semi-big">${bisSlotName}</td>
                    <td align='center' class="big">${key}</td>
                    <td align='center' class="semi-big">${bisForClasses[key]["classAndSpecName"]}</td>
                </tr>`);
    }
  });

  newTable += `</tr></table>`;

  return (itemTable.innerHTML = newTable);
};

initializeClassSelectList = (data) => {
  selectClassList.options.length = 1;
  //addOptionToSelectList("Select a class to get its specs", selectClassList);
  Object.keys(data).map((className) => {
    return addOptionToSelectList(className, selectClassList);
  });
};

getBisListForSpec = (data, firstSelectValue, secondSelectValue) => {
  itemTable.innerHTML = "";
  const bisForSpec = {};

  let newTable = `
    <table class="${tableClass} sortable" >
        <tr>
            <th>Item's Slot</th>
            <th>Item's Name</th>
            <th>From</th>
            <th>Type</th>
        </tr>
        <tr>`;

  Object.keys(data).map((className) => {
    if (firstSelectValue === className) {
      const classSpecValue = data[className];

      Object.keys(classSpecValue).map((specName) => {
        if (secondSelectValue === specName) {
          const specBisList = classSpecValue[specName];

          Object.keys(specBisList).map((bisSlotName) => {
            let bisName = specBisList[bisSlotName];

            if (typeof bisName === "string") {
              if (language === "cn") {
                bisName = bisName;
              }
              bisForSpec[bisSlotName] = bisName;
            } else {
              if (language === "cn") {
                bisName = bisName;
              }
              bisForSpec[bisSlotName] = bisName;
            }
          });
        }
      });
    }
  });

  Object.keys(bisForSpec).map((key) => {
    const bis = bisForSpec[key];
    let newTableString = `
                    <tr>
                        <td align='center' class="big">${key}</td>`;
    let newTableItemNameString = "";
    let newTableFromString = "";
    let newTableTypeString = "";
    let newTableStartString = `
                    <td>
                        <table class="nested-table" style="width: 100%;">`;
    let newTableEndString = `
                        </table>
                    </td>`;
    if (typeof bis !== "string") {
      for (let b of bis) {
        const elements = b.split("<td>");
        newTableItemNameString += `
                                <tr>
                                        <td align='center' class="semi-big">${elements[0]}
                                </tr>
                    `;
        newTableFromString += `
                                <tr>
                                        <td align='center' class="semi-big">${elements[1]}
                                </tr>
                    `;
        newTableTypeString += `
                                <tr>
                                        <td align='center' class="semi-big">${elements[2]}</td>
                                </tr>
                    `;
      }
      newTableItemNameString =
        newTableStartString + newTableItemNameString + newTableEndString;
      newTableFromString =
        newTableStartString + newTableFromString + newTableEndString;
      newTableTypeString =
        newTableStartString + newTableTypeString + newTableEndString;

      newTableString +=
        newTableItemNameString +
        newTableFromString +
        newTableTypeString +
        "</tr>";

      return (newTable += newTableString);
    } else if (bis === "-") {
      return (newTable += `
        <tr>
                        <td align='center' class="big">${key}</td>
                        <td align='center' class="semi-big" colspan="3">-</td>
                    </tr>`);
    } else {
      return (newTable += `
                    <tr>
                        <td align='center' class="big">${key}</td>
                        <td align='center' class="semi-big">${bis}</td>
                    </tr>`);
    }
  });
  newTable += `</tr></table>`;

  // if (language==="cn"){
  //   newTable = newTable.replaceAll(
  //       searchValue,
  //       replaceValue
  //     )
  // }
  itemTable.innerHTML = newTable;
};

setSpecListFromSelectedClass = (data, e) => {
  const selectedValue = e.target.value;

  return Object.keys(data).map((className) => {
    if (selectedValue === className) {
      Object.keys(data[className]).map((specName, index) => {
        if (index === 0) {
          getBisListForSpec(itemsList, selectClassList.value, specName);
        }
        return addOptionToSelectList(specName, selectSpecList);
      });
    }
  });
};

let currentE;

changeSelect = (e) => {
  currentE = e;
  // Reset spec selection
  selectSpecList.options.length = 0;
  if (e.target.value !== "") {
    inputItemName.disabled = true;
    inputItemName.classList.add("disabled");
    selectSpecList.disabled = false;
    selectSpecList.classList.remove("disabled");
    searchButton.disabled = true;
    searchButton.classList.add("disabled");

    rewriteHTMLTable(itemsList, "NoItemSelected");
    return setSpecListFromSelectedClass(itemsList, e);
  } else {
    inputItemName.disabled = false;
    inputItemName.classList.remove("disabled");
    selectSpecList.disabled = true;
    selectSpecList.classList.add("disabled");
    searchButton.disabled = false;
    searchButton.classList.remove("disabled");

    addOptionToSelectList("Select a spec to get its BiS", selectSpecList);
    return rewriteHTMLTable(itemsList, inputItemName.value.toLowerCase());
  }
};

changeSpecSelect = (e) => {
  return getBisListForSpec(itemsList, selectClassList.value, e.target.value);
};

changeSearch = () => {
  return rewriteHTMLTable(itemsList, inputItemName.value.toLowerCase());
};

initializeClassSelectList(data);
rewriteHTMLTable(itemsList, inputItemNameValue);
inputItemName.addEventListener("change", (e) => {
  changeSearch(e);
  makeSortable();
});
selectClassList.addEventListener("change", (e) => {
  changeSelect(e);
  adjustColumnHeight("nested-table");
  makeSortable();
});
selectSpecList.addEventListener("change", (e) => {
  changeSpecSelect(e);
  adjustColumnHeight("nested-table");
  makeSortable();
});

adjustColumnHeight = (className) => {
  var tables = document.getElementsByClassName(className);
  var maxHeights = [];

  // Find the maximum height in each column
  for (var i = 0; i < tables.length; i++) {
    var tds = tables[i].getElementsByTagName("td");
    for (var j = 0; j < tds.length; j++) {
      var tdHeight = tds[j].offsetHeight;
      if (!maxHeights[j] || tdHeight > maxHeights[j]) {
        maxHeights[j] = tdHeight;
      }
    }
  }

  // Apply the maximum height to all cells in each column
  for (var i = 0; i < tables.length; i++) {
    var tds = tables[i].getElementsByTagName("td");
    for (var j = 0; j < tds.length; j++) {
      tds[j].style.height = maxHeights[j] + "px";
    }
  }
};
