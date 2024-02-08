import React, { HTMLInputTypeAttribute } from "react";

function SmallInput({
    inputText = "text",
    submit,
    onClose,
}: {
    inputText?: HTMLInputTypeAttribute;
    submit(str: string): Promise<void>;
    onClose(): Promise<void>;
}) {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") {
            return;
        }
        submit(event.currentTarget.value);
    };

    return (
        <div>
            <label htmlFor="input"></label>
            <input type={inputText} name="input" onKeyDown={handleKeyDown} onMouseLeave={() => onClose()} onInput={() => {}}></input>
        </div>
    );
}

export default SmallInput;
