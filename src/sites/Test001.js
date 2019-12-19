import * as React from 'react';
import ndjsonStream from 'can-ndjson-stream';

type Props = {};
type State = {};

export class Test001 extends React.Component<Props, State> {

    async componentDidMount(): void {


        this.getStream();
    }

    async getStream() {
        fetch("http://35.221.245.158:8080/TickTock?time=5").then((response) => {
            return ndjsonStream(response.body); //ndjsonStream parses the response.body
        }).then((exampleStream) => {
            const reader = exampleStream.getReader();
            let read;
            reader.read().then(read = (result) => {
                if (result.done) {
                    return;
                }
                console.log(result.value);
                reader.read().then(read);

            });
        });
    }

    render() {
        return (
            <div>

                asdlfksadlfkslakdfl
            </div>
        );
    };
};
