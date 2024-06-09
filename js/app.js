const itemTable = document.getElementById("itemTable");
const inputItemName = document.getElementById('inputItemName');
const inputItemNameValue = inputItemName.value.toLowerCase();
const searchButton = document.getElementById('startSearch');
const selectClassList = document.getElementById('classSelect');
const selectSpecList = document.getElementById('specSelect');

const itemsList = data;
const tableClass = 'table table-dark table-striped text-center table-bordered table-sm'


addOptionToSelectList = (value, selectList) => {
    const opt = document.createElement('option');
    opt.appendChild(document.createTextNode(value));
    opt.value = value;

    return selectList.appendChild(opt);
};


// Very interesting post about wow class colors
// https://chasechristian.com/blog/2015/08/the-history-of-wow-class-colors/
// Last colors is druid
classColor = (className) => {
    return className.match('Shaman') ? '2359FF' :
        className.match('Rogue') ? 'FFF468' :
            className.match('Hunter') ? 'AAD372' :
                className.match('Priest') ? 'F0EBE0' :
                    className.match('Warlock') ? '9382C9' :
                        className.match('Warrior') ? 'C69B6D' :
                            className.match('Mage') ? '68CCEF' :
                                className.match('Death Knight') ? 'C41E3B' :
                                    className.match('Paladin') ? 'F48CBA' : 'FF7C0A';
};


addBisAsKey = (bisForClasses, classAndSpecName, bisName) => {
    if (!(bisName in bisForClasses)) {
        return bisForClasses[bisName] = classAndSpecName
    } else {
        if (bisForClasses[bisName].match(classAndSpecName)) {
            return;
        };
        return bisForClasses[bisName] += classAndSpecName
    }
};

const searchValue = "wotlk/"
let replaceValue = "wotlk/"

const languageList = document.getElementById("languages");
languageList.addEventListener("change", ()=>{
    language = languageList.value;
    if(language === "en"){
        replaceValue = "wotlk/"
        linkSearchValue = "https://www.wowhead.com/wotlk/item="
    }else if(language === "cn"){
        replaceValue = "wotlk/cn/"
        linkSearchValue = "https://www.wowhead.com/wotlk/cn/item="
    }
    //.replace(searchValue,replaceValue)
    if(currentE){
        changeSelect(currentE)
    }else{
        rewriteHTMLTable(itemsList, inputItemNameValue);
    }
})


rewriteHTMLTable = (data, inputValue) => {
    itemTable.innerHTML = "";
    const bisForClasses = {};

    let newTable = (`
        <table class="${tableClass}">
            <tr>
                <th>Item's Name</th>
                <th>Classes</th>
            </tr>
            <tr>`
    ); 


    Object.keys(data).map(className => {
        const classSpecValue = data[className];

        return Object.keys(classSpecValue).map(specName => {
            const specBisList = classSpecValue[specName];

            return Object.keys(specBisList).map(bisSlotName => {
                const bisName = specBisList[bisSlotName]
                const classAndSpecName = `<span style="color: #${classColor(className)}">${className + ' ' + specName}</span><br/>`

                if (typeof bisName === 'string') {
                    bis = specBisList[bisSlotName].replace(searchValue,replaceValue)
                    if (bis === '-') {
                        return;
                    };
                    return addBisAsKey(bisForClasses, classAndSpecName, bis)
                } else {
                    return bisName.map(key => {
                        return addBisAsKey(bisForClasses, classAndSpecName, key.replace(searchValue,replaceValue))
                    })
                };
            });
        });
    });

    Object.keys(bisForClasses).map(key => {
        if (inputValue === '' || key.toLowerCase().match(inputValue)) {
            return newTable += (`
                <tr>
                    <td align='center' class="big">${key}</td>
                    <td align='center' class="semi-big">${bisForClasses[key]}</td>
                </tr>`
            )
        }
    });

    newTable += `</tr></table>`;

    return itemTable.innerHTML = newTable;
};


initializeClassSelectList = (data) => {
    Object.keys(data).map(className => {
        return addOptionToSelectList(className, selectClassList)
    });
};


getBisListForSpec = (data, firstSelectValue, secondSelectValue) => {
    itemTable.innerHTML = "";
    const bisForSpec = {};

    let newTable = (`
    <table class="${tableClass}">
        <tr>
            <th>Item's Slot</th>
            <th>Item's Name</th>
        </tr>
        <tr>`
    );

    Object.keys(data).map(className => {
        if (firstSelectValue === className) {
            const classSpecValue = data[className];

            Object.keys(classSpecValue).map(specName => {
                if (secondSelectValue === specName) {
                    const specBisList = classSpecValue[specName];

                    Object.keys(specBisList).map(bisSlotName => {
                        const bisName = specBisList[bisSlotName]

                        if (typeof bisName === 'string') {
                            bisForSpec[bisSlotName] = bisName.replace(searchValue,replaceValue);
                        } else {
                            bisForSpec[bisSlotName] = bisName.join(' / ');
                        }
                    });

                }

            })
        }
    });

    Object.keys(bisForSpec).map(key => {
        return newTable += (`
                <tr>
                    <td align='center' class="big">${key}</td>
                    <td align='center' class="semi-big">${bisForSpec[key]}</td>
                </tr>`
        )
    });
    newTable += `</tr></table>`;

    itemTable.innerHTML = newTable;
};


setSpecListFromSelectedClass = (data, e) => {
    const selectedValue = e.target.value;

    return Object.keys(data).map(className => {
        if (selectedValue === className) {
            Object.keys(data[className]).map((specName, index) => {
                if (index === 0) {
                    getBisListForSpec(itemsList, selectClassList.value, specName)
                };

                return addOptionToSelectList(specName, selectSpecList)
            });
        }
    });
};

let currentE;

changeSelect = (e) => {
    currentE = e
    // Reset spec selection
    selectSpecList.options.length = 0
    if (e.target.value !== '') {
        inputItemName.disabled = true
        inputItemName.classList.add('disabled')
        selectSpecList.disabled = false
        selectSpecList.classList.remove('disabled')
        searchButton.disabled = true;
        searchButton.classList.add('disabled')


        rewriteHTMLTable(itemsList, 'NoItemSelected')
        return setSpecListFromSelectedClass(data, e);
    } else {
        inputItemName.disabled = false
        inputItemName.classList.remove('disabled')
        selectSpecList.disabled = true
        selectSpecList.classList.add('disabled')
        searchButton.disabled = false;
        searchButton.classList.remove('disabled')


        addOptionToSelectList('Select a a spec to get its BiS', selectSpecList)
        return rewriteHTMLTable(itemsList, inputItemName.value.toLowerCase())
    };
};


changeSpecSelect = (e) => {
    return getBisListForSpec(itemsList, selectClassList.value, e.target.value)
};


changeSearch = () => {
    return rewriteHTMLTable(itemsList, inputItemName.value.toLowerCase())
};

initializeClassSelectList(data);
rewriteHTMLTable(itemsList, inputItemNameValue);
inputItemName.addEventListener('change', changeSearch);
selectClassList.addEventListener('change', changeSelect);
selectSpecList.addEventListener('change', changeSpecSelect)
