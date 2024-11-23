import { Suspense, useContext, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import DarkModeContext from "../Utils/DarkModeContext.jsx";

const JsonFormatter = () => {
  const [inputJSON, setInputJSON] = useState("");
  const [formattedJSON, setFormattedJSON] = useState("");
  const [error, setError] = useState("");
  const [indentation, setIndentation] = useState(2);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const darkModeValue = localStorage.getItem("darkMode");
    return darkModeValue === "true";
  });

  // Update isDarkMode when localStorage changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "darkMode") {
        setIsDarkMode(event.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Update localStorage when isDarkMode changes
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    if (inputJSON.trim() === "") {
      setFormattedJSON("");
      setError("");
      return;
    }
    try {
      const parsedJSON = JSON.parse(inputJSON);
      const indentValue = indentation === 0 ? 0 : indentation;
      const formatted = JSON.stringify(parsedJSON, null, indentValue);
      setFormattedJSON(formatted);
      setError("");
    } catch (e) {
      setError(`Error: ${e.message}`);
      setFormattedJSON("");
    }
  }, [inputJSON, indentation]);

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formattedJSON);
      alert("Copied to clipboard!");
    } else {
      alert("Clipboard API not supported.");
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([formattedJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formatted.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 border rounded-md dark:bg-gray-800 dark:text-white text-gray-800 bg-white">
      <h3 className="text-lg font-bold mb-4">JSON Formatter</h3>
      <div className="mb-4">
        <Suspense fallback={<div>Loading Editor...</div>}>
          <Editor
            height="200px"
            defaultLanguage="json"
            value={inputJSON}
            onChange={(value) => setInputJSON(value || "")}
            theme={isDarkMode ? "vs-dark" : "light"}
            options={{
              minimap: { enabled: false },
            }}
          />
        </Suspense>
      </div>
      <div className="mb-4 flex items-center">
        <label
          htmlFor="indentation"
          className={`mr-2 ${isDarkMode ? "text-white" : "text-black"}`}
        >
          Indentation:
        </label>
        <select
          id="indentation"
          className={`p-2 border rounded-md ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
          value={indentation}
          onChange={(e) => setIndentation(parseInt(e.target.value))}
        >
          <option value={2}>2 Spaces</option>
          <option value={4}>4 Spaces</option>
          <option value={0}>Minify</option>
        </select>
      </div>
      {error && (
        <pre className="mt-4 p-2 bg-red-100 text-red-700 rounded-md overflow-auto">
          {error}
        </pre>
      )}
      {formattedJSON && (
        <div className="mt-4">
          <h2
            className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-black"}`}
          >
            Formatted JSON:
          </h2>
          <Suspense fallback={<div>Loading Editor...</div>}>
            <Editor
              height="200px"
              defaultLanguage="json"
              value={formattedJSON}
              theme={isDarkMode ? "vs-dark" : "light"}
              options={{
                readOnly: true,
                minimap: { enabled: false },
              }}
            />
          </Suspense>

          {/* Buttons */}
          <div className="flex space-x-2 mt-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md"
              onClick={copyToClipboard}
            >
              Copy to Clipboard
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md"
              onClick={downloadJSON}
            >
              Download JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonFormatter;
