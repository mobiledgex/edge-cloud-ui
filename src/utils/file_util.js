/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    textField.textContent = data
    document.body.appendChild(textField)
    textField.select()
    textField.focus()
    document.execCommand('copy')
    textField.remove()
}

export const readJsonFile = async (fileName) => {
    const response = await fetch(`data/${fileName}`)
    return await response.json()
}