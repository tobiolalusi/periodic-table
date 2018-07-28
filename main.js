const main = document.querySelector("main");
const modal = document.querySelector(".modal-container");
const filterLabel = document.querySelectorAll(".filter-container .label");

const elementGroups = [
	"nonmetal",
	"noble gas",
	"alkali metal",
	"alkaline earth metal",
	"metalloid",
	"halogen",
	"transition metal",
	"post-transition metal",
	"lanthanoid",
	"actinoid"
];

// Set element color
function setElementRGB(category) {
	switch (category) {
		case "nonmetal":
			return '225, 40, 10';
		case "noble gas":
			return '225, 95, 0';
		case "alkali metal":
			return '30, 135, 20';
		case "alkaline earth metal":
			return '0, 116, 205';
		case "metalloid":
			return '75, 0, 130';
		case "halogen":
			return '178, 80, 188';
		case "transition metal":
			return '46, 139, 87';
		case "post-transition metal":
			return '25, 55, 100';
		case "lanthanoid":
			return '125, 142, 42';
		case "actinoid":
			return '0, 128, 128';
		default:
			return '0, 0, 0';
	}
}

// Create XMLHttpRequest to fetch JSON data
const xhttp = new XMLHttpRequest();
xhttp.overrideMimeType("application/json");
xhttp.onreadystatechange = function () {
	if (xhttp.readyState == 4 && xhttp.status == "200") {
		const periodicTableData = JSON.parse(xhttp.responseText);
		// Create a separate container for each element
		periodicTableData.elements.forEach(element => {
			const appendedElementContainer = document.createElement('section');
			appendedElementContainer.className = `element element-${element.atomicNumber}`;

			const appendedElementLeftInfo = document.createElement("section");
			appendedElementLeftInfo.className = "left-info";

			const appendedElementNumber = document.createElement('span');
			appendedElementNumber.innerHTML = element.atomicNumber;
			appendedElementNumber.className = `number`;

			const appendedElementSymbol = document.createElement('span');
			appendedElementSymbol.innerHTML = element.symbol;
			appendedElementSymbol.className = `symbol`;

			const appendedElementName = document.createElement('span');
			appendedElementName.innerHTML = element.name;
			appendedElementName.className = `name`;

			const appendedElementMass = document.createElement('span');
			appendedElementMass.innerHTML = element.atomicMass;
			appendedElementMass.className = `mass`;

			appendedElementLeftInfo.appendChild(appendedElementNumber);
			appendedElementLeftInfo.appendChild(appendedElementSymbol);
			appendedElementLeftInfo.appendChild(appendedElementName);
			appendedElementLeftInfo.appendChild(appendedElementMass);

			const appendedElementRightInfo = document.createElement('div');
			appendedElementRightInfo.className = "right-info";

			element.shells.forEach(shellNumber => {
				const shell = document.createElement('span');
				shell.innerHTML = shellNumber;
				appendedElementRightInfo.appendChild(shell);
			});

			appendedElementContainer.appendChild(appendedElementLeftInfo);
			appendedElementContainer.appendChild(appendedElementRightInfo);

			Object.assign(appendedElementContainer.style, {
				gridRow: element.ypos,
				gridColumn: element.xpos,
				backgroundColor: `rgba(${setElementRGB(element.groupBlock)}, .5)`,
				borderColor: `rgb(${setElementRGB(element.groupBlock)})`
			});
			
			appendedElementContainer.addEventListener('mouseover', function () {
				appendedElementContainer.style.borderColor = "rgba(255, 255, 255, .65)";
				document.querySelector(".preview").style.borderBottomColor = `rgba(${setElementRGB(element.groupBlock)}, .6)`;
				document.querySelector(".preview .number").innerHTML = element.atomicNumber;
				document.querySelector(".preview .symbol").innerHTML = element.symbol;
				document.querySelector(".preview .name").innerHTML = element.name;
				document.querySelector(".preview .mass").innerHTML = element.atomicMass;
				document.querySelector(".preview .right-info").innerHTML = "";
				element.shells.forEach(shellNumber => {
					const shell = document.createElement('span');
					shell.innerHTML = shellNumber;
					document.querySelector(".preview .right-info").appendChild(shell);
				});
				filterLabel.forEach(group => {
					const groupLabelHTML = group.textContent.toLowerCase();
					if(groupLabelHTML === element.groupBlock) {
						group.style.borderColor = "rgba(255, 255, 255, .65)";
					}
				});
			});

			appendedElementContainer.addEventListener('mouseout', function () {
				appendedElementContainer.style.borderColor = `rgb(${setElementRGB(element.groupBlock)})`;
				filterLabel.forEach(group => {
					const groupLabelHTML = group.textContent.toLowerCase();
					if(groupLabelHTML === element.groupBlock) {
						group.style.borderColor = `rgb(${setElementRGB(element.groupBlock)})`;
					}
				});
			});

			appendedElementContainer.addEventListener('click', function () {
				modal.style.display = "flex";
				main.style.filter = "blur(5px) grayscale(50%)";
				document.querySelector(".modal").style.color = `rgb(${setElementRGB(element.groupBlock)})`;
				document.querySelector(".modal .notation .number").innerHTML = element.atomicNumber;
				document.querySelector(".modal .notation .symbol").innerHTML = element.symbol;
				document.querySelector(".modal .notation .mass").innerHTML = element.atomicMass;
				document.querySelector(".modal .group").innerHTML = element.groupBlock;
				document.querySelector(".modal .name").innerHTML = element.name;
				document.querySelector(".modal .summary").innerHTML = element.summary;
				document.querySelector(".modal .more-info .standard-state").innerHTML = element.standardState ? element.standardState : "-";
				document.querySelector(".modal .more-info .bonding-type").innerHTML = element.bondingType ? element.bondingType : "-";
				document.querySelector(".modal .more-info .ion-radius").innerHTML = element.ionRadius ? element.ionRadius : "-";
				document.querySelector(".modal .more-info .atomic-radius").innerHTML = element.atomicRadius ? element.atomicRadius : "-";
				document.querySelector(".modal .more-info .electronic-configuration").innerHTML = element.electronicConfiguration ? element.electronicConfiguration : "-";
				document.querySelector(".modal .more-info .electronegativity").innerHTML = element.electronegativity ? element.electronegativity : "-";
				document.querySelector(".modal .more-info .ionization-energy").innerHTML = element.ionizationEnergy ? element.ionizationEnergy : "-";
				document.querySelector(".modal .more-info .electron-affinity").innerHTML = element.electronAffinity ? element.electronAffinity: "-";
				document.querySelector(".modal .more-info .oxidation-states").innerHTML = element.oxidationStates ? element.oxidationStates: "-";
				document.querySelector(".modal .more-info .density").innerHTML = element.density ? element.density : "-";
				document.querySelector(".modal .more-info .melting-point").innerHTML = element.meltingPoint ? `${element.meltingPoint}&deg;K` : "-";
				document.querySelector(".modal .more-info .boiling-point").innerHTML = element.boilingPoint ? `${element.boilingPoint}&deg;K` : "-";
				document.querySelector(".modal .more-info .shells").innerHTML = "";
				element.shells.forEach((shell, shellPos) => {
					const shellNum = shellPos + 1 < element.shells.length ? `${shell}, ` : shell;
					const initialText = document.querySelector(".modal .more-info .shells").textContent;
					document.querySelector(".modal .more-info .shells").innerHTML = `${initialText}${shellNum}`;
				});
			});

			elementGroups.forEach((group, key) => {
				const groupLabelElement = filterLabel[key];
				const groupLabelHTML = groupLabelElement.textContent.toLowerCase();
				if(groupLabelHTML === group) {
					Object.assign(groupLabelElement.style, {
						backgroundColor: `rgba(${setElementRGB(groupLabelHTML)}, .6)`,
						borderColor: `rgb(${setElementRGB(groupLabelHTML)})`
					});
				}
				groupLabelElement.addEventListener("mouseover", function () {
					groupLabelElement.style.borderColor = "rgba(255, 255, 255, .65)";
					if(element.groupBlock === groupLabelHTML) {
						document.querySelector(`main .element.element-${element.atomicNumber}`).style.borderColor = "rgba(255, 255, 255, .65)";
					}
				});
				groupLabelElement.addEventListener("mouseout", function () {
					groupLabelElement.style.borderColor = `rgb(${setElementRGB(groupLabelHTML)})`;
					if(element.groupBlock === groupLabelHTML) {
						document.querySelector(`main .element.element-${element.atomicNumber}`).style.borderColor = `rgb(${setElementRGB(groupLabelHTML)})`;
					}
				});
			});

			main.appendChild(appendedElementContainer);
		});
	}
};
xhttp.open('GET', 'periodic-table-data.json', true);
xhttp.send();

const modalCloseButton = document.querySelector(".modal .close-button");
modalCloseButton.addEventListener("click", function () {
	modal.style.display = "none";
	main.style.filter = "none";
});
