document.addEventListener("DOMContentLoaded", () => {

    (() => {

        const textArea = document.querySelector("#input-textarea");
        const buttonValidate = document.querySelector("#validate-button");
        const buttonReset = document.querySelector("#reset-button");
        const tableBody = document.querySelector("#output-table-body");

        //NOTE: apperantly, global flag changes the behavior of regex.test or regex.exec methods (look up regexp lastIndex)
        const linkRegex = /^(https:\/\/)?(www\.)?(discord)(\.com\/invite\/[A-Za-z0-9]+|\.gg\/[A-Za-z0-9]+)$/;
        const whiteSpaceRegex = /\s+/g
        const httpsRegex = /https:\/\//;
        const inviteRegex = /\/[A-Za-z0-9]+$/;

        init();

        function init() {

            buttonValidate.addEventListener("click", () => {

                createTemplate();

            });

            buttonReset.addEventListener("click", () => {

                resetContent(); 

            });

        }

        function getTextAreaInput() {

            const textAreaValue = textArea.value;

            if (textAreaValue !== "") {

                inputArray = textAreaValue.replace(whiteSpaceRegex, "").split(",");
                return inputArray;

            } else {

                alert("No input found!");

            }

        }

        function parseTextAreaInput() {

            const inputArray = getTextAreaInput();
            const inviteArray = [];

            if (inputArray) {
                
                for (let link of inputArray) {

                    const newLink = "https://discord.gg/" + link;

                    if (linkRegex.test(link)) {

                        if(httpsRegex.test(link.slice(0, 8))) {

                            inviteArray.push(link);

                        } else {

                            link = "https://" + link;
                            inviteArray.push(link);

                        }

                    } else if (linkRegex.test(newLink)) {

                        inviteArray.push(newLink);

                    }

                }

                if (inviteArray.length > 0) {

                    return inviteArray;

                } else {

                    alert("No valid input!");

                }

            } 

        }

        function validateInvite() {

            const inputArray = parseTextAreaInput();
            const inviteLinkArray = [];
            const inviteStatusArray = [];
            const invitesObject = {inviteLinks: inviteLinkArray, inviteStatus: inviteStatusArray};

            if (inputArray) {

                for (let link of inputArray) {

                    const inviteCode = link.match(inviteRegex)[0].slice(1);

                    
                    fetch(`https://discordapp.com/api/invite/${inviteCode}`)
                        .then(res => res.json())
                        .then(json => {
                            
                            if (json.message !== "Unknown Invite") {

                                inviteLinkArray.push(link);
                                inviteStatusArray.push(true);

                            } else {

                                inviteLinkArray.push(link);
                                inviteStatusArray.push(false);

                            }

                        });
    
                }

            }

            return invitesObject;

        }

        function createTemplate() {

            const invitesObject = validateInvite();
            console.log(invitesObject)
            const inviteLinkArray = [...invitesObject["inviteLinks"]];
            const inviteStatusArray = [...invitesObject["inviteStatus"]];

            if (inviteLinkArray) {
 
                console.log(invitesObject['inviteLinks'][0]); 

                for (let link of inviteLinkArray) {

                    const newRow = document.createElement("tr");
    
                    const template = `
                        <td>
                            <a href="${link}" target="_blank" rel="noopener noreferrer">
                            ${link}
                            </a>
                        </td>
                        <td>
                            <span class="${inviteStatusArray[inviteLinkArray.indexOf(link)] === true ? "valid" : "not-valid"}">${inviteStatusArray[inviteLinkArray.indexOf(link)] === true ? "Valid" : "Not Valid"}</span>
                        </td>
                    `;

                    newRow.innerHTML = template;
                    tableBody.appendChild(newRow);
    
                }

            }

        }

        function resetContent() {

            textArea.value = "";
            tableBody.innerHTML = "";

        }

    })();

});