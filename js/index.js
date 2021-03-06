document.addEventListener("DOMContentLoaded", () => {

    (() => {

        const textArea = document.querySelector("#input-textarea");
        const buttonValidate = document.querySelector("#validate-button");
        const buttonReset = document.querySelector("#reset-button");
        const tableBody = document.querySelector("#output-table-body");

        //NOTE: apparently, global flag changes the behavior of regex.test or regex.exec methods (look up regexp lastIndex)
        const linkRegex = /^(https:\/\/)?(www\.)?(discord)(\.com\/invite\/[A-Za-z0-9]+|\.gg\/[A-Za-z0-9]+)$/;
        const whiteSpaceRegex = /\s+/g
        const httpsRegex = /https:\/\//;
        const inviteRegex = /\/[A-Za-z0-9]+$/;

        init();

        function init() {

            buttonValidate.addEventListener("click", (e) => {

                validateInvites();   
                e.preventDefault();

            });

            buttonReset.addEventListener("click", (e) => {

                resetContent(); 
                e.preventDefault();

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

        function validateInvites() {

            const inviteArray = parseTextAreaInput();

            for (let invite of inviteArray) {

                fetchInvite(invite);

            }

        }

        function fetchInvite(invite) {

            const inviteObject = {link: null, status: null};

            if (invite) {

                const inviteCode = invite.match(inviteRegex)[0].slice(1);

                fetch(`https://discordapp.com/api/invite/${inviteCode}`)
                    .then(res => res.json())
                    .then(json => {
                            
                        if (json.message !== "Unknown Invite") {

                            inviteObject.link = invite;
                            inviteObject.status = true;

                        } else {

                            inviteObject.link = invite;
                            inviteObject.status = false;

                        }

                        return inviteObject;

                    })
                    .then((obj) => {createTemplate(obj);})
                    .catch((err) => {alert(err)});

            }

        }

        function createTemplate(inviteObject) {

            if (inviteObject) {
 
                const newRow = document.createElement("tr");
    
                const template = `
                    <td>
                        <a href="${inviteObject.link}" target="_blank" rel="noopener noreferrer">
                        ${inviteObject.link}
                        </a>
                    </td>
                    <td>
                        <span class="${inviteObject.status === true ? "valid" : "not-valid"}">${inviteObject.status === true ? "Valid" : "Not Valid"}</span>
                    </td>
                `;

                newRow.innerHTML = template;
                tableBody.appendChild(newRow);
    
            }

        }

        function resetContent() {

            textArea.value = "";
            tableBody.innerHTML = "";

        }

    })();

});
