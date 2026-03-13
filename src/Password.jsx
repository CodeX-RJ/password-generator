import React, { useState } from "react";
import { sha256 } from "js-sha256";
import "./Password.css";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const reverseAlphabet = "zyxwvutsrqponmlkjihgfedcba";

const Password = () => {

  const [platform, setPlatform] = useState("");
  const [masterSecret, setMasterSecret] = useState("");
  const [passwordLength, setPasswordLength] = useState(12);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMaster, setShowMaster] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const mapForward = (num) => alphabet[num];
  const mapReverse = (num) => reverseAlphabet[num];

  const adjustPassword = (str) => {
    let arr = str.split("");

    if (!isNaN(arr[0])) {
      if (!isNaN(arr[0])) arr[0] = mapForward(parseInt(arr[0]));
      if (!isNaN(arr[2])) arr[2] = mapForward(parseInt(arr[2]));
    } else {
      if (!isNaN(arr[1])) arr[1] = mapReverse(parseInt(arr[1]));
      if (!isNaN(arr[3])) arr[3] = mapReverse(parseInt(arr[3]));
    }

    return arr.join("");
  };

  const generatePassword = () => {

    if (!platform || !masterSecret) {
      alert("Please enter platform identifier and master secret.");
      return;
    }

    const base = platform.toLowerCase().trim() + ":" + masterSecret;

    let hash = sha256(base).slice(0, passwordLength - 3);

    hash = adjustPassword(hash);

    const finalPassword = hash + "@RJ";

    setPassword(finalPassword);
    setShowPassword(false);
    setCopied(false);
  };

  const copyPassword = async () => {

    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
    } catch {

      const textarea = document.createElement("textarea");
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="container">

      <div className="card">

        <h1>Password Generator</h1>

        <p className="subtitle">
          Stop remembering dozens of passwords — remember one master secret
          and regenerate secure passwords for any platform anytime.
        </p>

        <button
          className="instructionToggle"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          {showInstructions ? "Hide Instructions" : "Show Instructions"}
        </button>

        {showInstructions && (
          <div className="instructions">

            <h3>Purpose of This Tool</h3>

            <p>
              Modern users often have accounts on many platforms including
              websites, mobile applications, banking services, and social
              networks. Remembering a different password for every platform
              quickly becomes difficult.
            </p>

            <p>
              Many people solve this problem by reusing the same password or
              storing passwords in insecure places. Both approaches reduce
              security.
            </p>

            <p>
              This tool solves that problem by allowing you to remember only
              one master secret. Instead of storing passwords, this generator
              creates them deterministically using the platform identifier
              and your master secret.
            </p>

            <p>
              This means you do not need to remember or store passwords for
              every platform. Whenever you need a password again, simply
              enter the same platform identifier, the same master secret,
              and the same password length to regenerate the exact same
              password.
            </p>

            <h3>Security Explanation</h3>

            <p>
              Passwords are generated using a cryptographic hash function.
              Hash functions are one-way operations, meaning the generated
              password cannot be reversed to discover the master secret.
            </p>

            <p>
              Even if someone knows the password of one platform, knows the
              platform identifier, or even has access to the source code of
              this tool, they still cannot determine your master secret.
            </p>

            <p>
              All password generation happens locally in your browser. This
              tool does not store any passwords or secrets.
            </p>

            <h3>Platform Identifier Rules</h3>

            <p>
              Use the main name of the service as the platform identifier.
            </p>

            <ul>
              <li>facebook.com → facebook</li>
              <li>mail.google.com → google</li>
              <li>amazon.in → amazon</li>
              <li>netflix.com → netflix</li>
            </ul>

            <p>
              For apps without websites use the app name.
            </p>

            <ul>
              <li>whatsapp</li>
              <li>phonepe</li>
              <li>paytm</li>
              <li>spotify</li>
            </ul>

            <p>
              Always use lowercase identifiers and keep them consistent.
              Changing the identifier even slightly will generate a
              completely different password.
            </p>

            <h3>Master Secret</h3>

            <p>
              Your master secret is the only thing you must remember.
              If you forget it, your passwords cannot be regenerated.
            </p>

            <h3>Password Length</h3>

            <p>
              The password length must remain the same if you want to
              regenerate the exact same password later.
            </p>

          </div>
        )}

        <label>Platform Identifier</label>

        <input
          type="text"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          placeholder="example: facebook"
        />

        <label>Master Secret</label>

        <div className="inputWrapper">

          <input
            type={showMaster ? "text" : "password"}
            value={masterSecret}
            onChange={(e) => setMasterSecret(e.target.value)}
            placeholder="enter your master secret"
          />

          <span
            className="inputIcon"
            onClick={() => setShowMaster(!showMaster)}
            title={showMaster ? "Hide secret" : "Show secret"}
          >
            {showMaster ? "🙈" : "👁"}
          </span>

        </div>

        <label>Password Length</label>

        <input
          type="number"
          value={passwordLength}
          onChange={(e) => setPasswordLength(Number(e.target.value))}
          min="8"
          max="64"
        />

        <button className="generateBtn" onClick={generatePassword}>
          Generate Password
        </button>

        {password && (

          <div className="passwordArea">

            <div className="inputWrapper passwordField">

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                readOnly
              />

              <span
                className="inputIcon"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </span>

            </div>

            <button
              className="copyBtn"
              onClick={copyPassword}
            >
              {copied ? "Copied" : "Copy"}
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default Password;