import React, { HTMLInputTypeAttribute } from "react";

function Input({
    inputText = "text",
    classname,
    initialValue,
    submit,
}: // onClose,
{
    inputText?: HTMLInputTypeAttribute;
    classname?: string;
    initialValue: boolean | string;
    submit(str: string | boolean): Promise<void>;
}) {
    return (
        <div>
            <label htmlFor="input"></label>
            <input
                checked={typeof initialValue === "boolean" && initialValue}
                value={(typeof initialValue === "string" && initialValue) || ""}
                className={classname}
                type={inputText}
                name="input"
                onInput={(event) => {
                    if (inputText === "checkbox") submit(event.currentTarget.checked);
                    else submit(event.currentTarget.value);
                }}
            ></input>
        </div>
    );
}

export default Input;
