import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import SplitPane from "react-split-pane"; 
 
import "brace/mode/javascript";
import "brace/mode/c_cpp";
import "brace/mode/java";
import "brace/mode/python";
 
import "brace/theme/dracula";
import "brace/theme/monokai";
import "brace/ext/language_tools";

 import ResetModal from "./ResetModal";

import LanguageInfoModal from "./LanguageInfoModal";

 
import "./Editor.css";
 
import stubs from "../stubs";
import ACTIONS from "../Actions";

const Editor = ({
  socketRef,
  roomId,
  onCodeChange,
  onInputChange,
  onOutputChange,
  onLanguageChange,
}) => {
  const [lang, setLang] = useState("Python");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [code, setCode] = useState(stubs[lang]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showLanguageInfoModal, setShowLanguageInfoModal] = useState(false);

  const handleSubmit = async () => {
    let outMsg = "";
    let errMsg = "";
    const dataPayload = {
      lang,
      code,
      input,
    };
    handleInputChange("");
    handleOutputChange("");
    try {
      const response = await fetch(`${"https://codeeditor-1xy3.onrender.com/"}run-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataPayload),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.stdout !== "") {
          outMsg = result.stdout;
        }
        if (result.stderr !== "") {
          errMsg = result.stderr.replace(/File "[^"]+", /g, "");
        }
        handleOutputChange(outMsg + errMsg);
        console.log("Backend Response:", result);
      } else {
        console.error("Backend API Request Failed");
      }
    } catch (error) {
      console.error("Backend API Request Error:", error);
    }
  };

  const clearInputOutput = () => {
    handleInputChange("");
    handleOutputChange("");
  };

  const onCloseResetModal = () => {
    setShowResetModal(false);
  };

  const onCloseLanguageInfoModal = () => {
    setShowLanguageInfoModal(false);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: newCode,
    });
  };

  const handleInputChange = (newInput) => {
    setInput(newInput);
    socketRef.current?.emit(ACTIONS.INPUT_CHANGE, {
      roomId,
      input: newInput,
    });
  };

  const handleOutputChange = (newOutput) => {
    setOutput(newOutput);
    socketRef.current?.emit(ACTIONS.OUTPUT_CHANGE, {
      roomId,
      output: newOutput,
    });
  };

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    handleCodeChange(stubs[newLang]);
    socketRef.current?.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language: newLang,
    });
  };

  useEffect(() => {
    const currentSocketRef = socketRef.current;
    if (currentSocketRef) {
      currentSocketRef.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          setCode(code);
          onCodeChange(code);
        }
      });

      currentSocketRef.on(ACTIONS.INPUT_CHANGE, ({ input }) => {
        if (input !== null) {
          setInput(input);
          onInputChange(input);
        }
      });

      currentSocketRef.on(ACTIONS.OUTPUT_CHANGE, ({ output }) => {
        if (output !== null) {
          setOutput(output);
          onOutputChange(output);
        }
      });

      currentSocketRef.on(ACTIONS.LANGUAGE_CHANGE, ({ language }) => {
        if (language !== null) {
          setLang(language);
          onLanguageChange(language);
        }
      });
    }

    return () => {
      if (currentSocketRef) {
        currentSocketRef.off(ACTIONS.CODE_CHANGE);
        currentSocketRef.off(ACTIONS.INPUT_CHANGE);
        currentSocketRef.off(ACTIONS.OUTPUT_CHANGE);
        currentSocketRef.off(ACTIONS.LANGUAGE_CHANGE);
      }
    };
  }, [
    onCodeChange,
    onInputChange,
    onLanguageChange,
    onOutputChange,
    socketRef.current,
  ]);

  return (
    <div className="flex w-full flex-row  sm:flex-row">
      <div className="w-full md:flex">
        {/* First Div */}
        <div className="w-full md:w-[70%]">
          <div className="flex  border-b-2  justify-between  p-4 md:flex-row">
            <div className="flex gap-4">
              <div className="w-full flex  gap-6  md:w-[80%]">
                <label className="hidden text-white md:block text-sm font-medium mb-1">
                  Select Language:
                </label>
                <select
                  className="w-full px-3 py-2 border rounded bg-gray-700 focus:outline-none focus:border-blue-500 text-white"
                  id="inlineFormSelectPref"
                  value={lang}
                  onChange={(e) => {
                    handleLanguageChange(e.target.value);
                  }}
                >
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="Cpp">Cpp</option>
                  <option value="JavaScript">JavaScript</option>
                </select>
              </div>

              <div className="tooltip-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="4 4 16 16"
                  width="1.5rem"
                  height="1.5rem"
                  fill="white"
                  className="mx-2 cursor-pointer"
                  onClick={() => setShowLanguageInfoModal(true)}
                >
                  <path
                    fillRule="evenodd"
                    d="M13.741 7.314a.95.95 0 00-.627-.272.95.95 0 00-.627.272.833.833 0 00-.246.614c0 .246.082.45.246.614a.85.85 0 00.627.245.85.85 0 00.627-.245.833.833 0 00.246-.614.832.832 0 00-.246-.614zm-.34 2.919c-.01-.273-.178-.41-.505-.41-.4.092-.914.36-1.541.805-.628.446-.969.696-1.023.75-.055.055-.082.091-.082.11l.082.136c.036.09.063.14.082.15.018.01.054-.004.109-.04l.627-.41c.564-.364.732-.16.505.614-.228.772-.505 1.94-.832 3.505-.055.709.127 1.013.545.913.419-.1.746-.231.982-.395l1.364-.955c.055-.036.073-.072.055-.109l-.11-.19c-.036-.037-.072-.055-.109-.055l-.027.027c-.218.145-.45.29-.695.436-.246.146-.405.146-.478 0-.036-.218.064-.754.3-1.609l.682-2.564c.055-.2.077-.436.068-.71z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="tooltip-text ">Language Info</span>
              </div>
            </div>

            <div className="flex gap-4 items-center w-[50%] justify-around">
              <div className="tooltip-container">
                <FontAwesomeIcon
                  icon={faArrowRotateRight}
                  flip="horizontal"
                  color="white"
                  onClick={() => {
                    setShowResetModal(true);
                  }}
                  className="w-12 h-6"
                />
                <span className="tooltip-text">Reset Code</span>
              </div>
              <ResetModal language={lang} handleCodeChange={handleCodeChange} />
              <button
                type="button"
                id="run"
                className="text-lg text-yellow-200 h-10 px-6 bg-cyan-600 justify-center rounded-xl"
                onClick={handleSubmit}
              >
                Run
              </button>
            </div>
          </div>
          <div className=" h-[450px] md:h-[85vh] ">
            <AceEditor
              placeholder="Write your code here"
              mode={lang === "Cpp" ? "c_cpp" : lang?.toLowerCase()}
              theme="dracula"
              name="editor"
              width="100%"
              height="100%"
              fontSize={17}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={false}
              value={code}
              onChange={handleCodeChange}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              enableSnippets={false}
              showLineNumbers={true}
              tabSize={4}
              $blockScrolling={{ Infinity }}
              onLoad={(editor) => {
                editor.renderer.setPadding(4);
              }}
            />
          </div>
        </div>

        {/* Second Div */}
        <div className="flex flex-col  md:flex-col w-full md:w-[30%] md:h-[94vh] md:border-l-2">
          <div className="   md:h-20 p-2  md:border-b-2 flex items-center  justify-center pl-4">
            <button
              type="button"
              className="text-lg px-24  text-yellow-200  h-10 md:px-6 bg-cyan-600 justify-center rounded-xl"
              onClick={clearInputOutput}
            >
              Clear
            </button>
          </div>

          <div className="h-[200px]  ">
            <div className="  h-[200px]   md:h-[85vh] flex  flex-row  md:flex-col   ">
              <textarea
                type="text"
                id="input"
                className="outline-none h-[200px] md:border-b-2 text-lg text-emerald-500 w-full p-2 bg-slate-900 md:h-[454px]"
                aria-label="Input"
                placeholder="Enter Input"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                style={{ resize: "none" }}
              ></textarea>
              <textarea
                readOnly
                type="text"
                id="output"
                className="outline-none sm:border-l-2 h-[200px] md:border-b-2  text-lg text-emerald-500 w-full p-2 bg-slate-900 md:h-[450px]"
                aria-label="Output"
                placeholder="Output"
                value={output}
                onChange={(e) => handleOutputChange(e.target.value)}
                style={{ resize: "none" }}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
