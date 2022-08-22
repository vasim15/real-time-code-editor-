import React, { useEffect, useRef, useState } from "react";
import CodeMirror, { useCodeMirror } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import actions from "../socket/actions.mjs";

const Editor = ({ roomId, socket, onCodeChange }) => {
  const [code, setCode] = useState();

  useEffect(() => {
    if (socket.current) {
      socket.current.on(actions.CODE_CHANGE, ({ code: serverCode }) => {
        if (serverCode !== null) {
          setCode(serverCode);
        }
      });
    }
    return () => {
      
      socket.current?.off(actions.CODE_CHANGE);
    };
  }, [socket.current]);
  return (
    <div>
      <CodeMirror
        value={code}
        theme="dark"
        height="100vh"
        className="codeMirror"
        extensions={[javascript({ jsx: true })]}
        onChange={(value, viewUpdate) => {
          onCodeChange(value);
          if (value !== null) {
            socket.current.emit(actions.CODE_CHANGE, {
              roomId,
              code: value,
            });
          }
        }}
      />
    </div>
  );
};

export default Editor;
