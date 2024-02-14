import React, { HTMLInputTypeAttribute } from "react";

function SmallInput({
    inputText = "text",
    classname,
    submit,
    onChange,
    onClose,
}: {
    inputText?: HTMLInputTypeAttribute;
    classname?: string;
    submit?(str: string): Promise<void>;
    onChange?: (str: string) => Promise<void>;
    onClose(): Promise<void>;
}) {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== "Enter") {
            return;
        }
        submit && submit(event.currentTarget.value);
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("date", event);
        onChange && onChange(event.currentTarget.value);
    };

    return (
        <div>
            <label htmlFor="input"></label>
            <input
                className={classname}
                type={inputText}
                name="input"
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onMouseLeave={() => onClose()}
                onInput={() => {}}
            ></input>
        </div>
    );
}

export default SmallInput;
