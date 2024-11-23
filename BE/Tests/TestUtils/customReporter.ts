import { Reporter } from "@jest/reporters";

class CustomReporter implements Reporter {
    onRunComplete(contexts: Set<unknown>, results: any): void {
        console.log("TESTS HAVE COMPLETED");
    }
}

export default CustomReporter;
