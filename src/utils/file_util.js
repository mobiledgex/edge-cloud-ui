export const downloadData = (fileName, data) => {
    const element = document.createElement("a");
    const file = new Blob([data], { type: 'text/yaml' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

export const uploadData = (e, callback, callbackData) => {
    e.preventDefault();
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "*";
    input.onchange = (event) => {
        let file = event.target.files[0];
        if (file) {
            if (file.size <= 1000000) {
                let reader = new FileReader();
                reader.onload = () => {
                    callback(reader.result, callbackData)
                };
                reader.readAsText(file)
            }
            else {
                this.props.handleAlertInfo('error', 'File size cannot be >1MB')
            }
        }
    };
    input.click();
}

export const copyData = (data) => {
    var textField = document.createElement('textarea')
    textField.innerText = data
    document.body.appendChild(textField)
    textField.select()
    textField.focus()
    document.execCommand('copy')
    textField.remove()
}