'use client'
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function EmailExtractor() {
    const [inputText, setInputText] = useState("");
    const [emails, setEmails] = useState<string[]>([]);
    const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);

    function parseForEmail() {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const extractedEmails = inputText.match(emailRegex) || [];
        setEmails(extractedEmails);
    }

    function parseForPhone() {
        const phoneRegex = /(\+?\d{1,4}[\s-]?)?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/g;
        const extractedPhoneNumbers = inputText.match(phoneRegex) || [];
        setPhoneNumbers(extractedPhoneNumbers);
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
                </div>
                <Textarea className="h-50 bg-gray-800 text-white" value={emails.join("\n")} readOnly />
                <Textarea className="h-50 bg-gray-800 text-white" value={phoneNumbers.join("\n")} readOnly />
            </div>
        </div>
    );
}