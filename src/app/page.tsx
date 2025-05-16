'use client'
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type emailType = {
    email: string;
    value: {
        validFormat: boolean;
        validMx: boolean;
        validSmtp: boolean;
    };
};

export default function EmailExtractor() {
    const [inputText, setInputText] = useState("");
    const [emails, setEmails] = useState<string[]>([]);
    const [validEmails, setValidEmails] = useState<string[]>([]);
    const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
    const [disableButton, setDisableButton] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState(false);

    function parseForEmail() {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const extractedEmails = inputText.match(emailRegex) || [];
        setEmails(extractedEmails);
        setDisableButton(false);
    }

    function parseForPhone() {
        const phoneRegex = /(\+?\d{1,4}[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/g;
        const extractedPhoneNumbers = inputText.match(phoneRegex) || [];
        setPhoneNumbers(extractedPhoneNumbers);
    }

    async function scanValidEmails() {
        setDisableButton(true);
        setLoadingStatus(true);
        if (emails.length === 0) {
            alert("Please extract emails first.");
            setLoadingStatus(false);
            return;
        }
        else {
            const bodyData = {
                emailList: emails,
            };
            const result = await fetch("https://email-backend-taupe.vercel.app/email", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData),
            });
            const data = await result.json();
            setValidEmails([]);
            data.forEach((email: emailType) => {
                if(email.value.validFormat && email.value.validMx && email.value.validSmtp) {
                    setValidEmails((prev) => [...prev, email.email]);
                }
            });
            setLoadingStatus(false);
            setDisableButton(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <div className="flex flex-col gap-4 w-200 h-200 mx-auto mt-8 border-2 p-8 rounded-lg border-white">
                <h1>Email and Phone Number Extractor</h1>
                <p>Enter text below to extract emails and phone numbers</p>
                <Textarea className="h-50 bg-gray-800 text-white" value={inputText} onChange={(e) => setInputText(e.target.value)} />
                <div className="flex gap-2">
                    <Button variant="outline" className="text-gray-400 border-white" onClick={parseForEmail}>Extract Emails</Button>
                    <Button variant="outline" className="text-gray-400 border-white" onClick={parseForPhone}>Extract Phone Numbers</Button>
                    <Button variant="outline" className="text-gray-400 border-white" disabled={disableButton} onClick={scanValidEmails}>Scan Valid Emails</Button>
                    <span className="text-gray-400 border-white">
                        <span className="flex items-center justify-center h-full">
                            {loadingStatus ? 
                                <svg className="animate-spin h-5 w-5 border-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill="none" d="M0 0h24v24H0z" />
                                    <path fill="white" d="M12 1v4a8 8 0 1 0 8 8h4a12 12 0 1 1-12-12z" />
                                </svg>
                                : ""}
                        </span>
                    </span>
                </div>
                <Textarea className="h-50 bg-gray-800 text-white" value={emails.join("\n")} readOnly />
                <Textarea className="h-50 bg-gray-800 text-white" value={phoneNumbers.join("\n")} readOnly />
                Valid Emails:
                <Textarea className="h-50 bg-gray-800 text-white" value={validEmails.join("\n")} readOnly />
            </div>
        </div>
    );
}