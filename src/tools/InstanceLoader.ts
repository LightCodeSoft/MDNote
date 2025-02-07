
export default class InstanceLoader {

    static getInstance<T>(context: { [key: string]: any }, name: string, ...args: any[]): T {
        const classRef: { new(...args: any[]): any; } = context[name];
        // console.log("classRef-->", classRef, ...args)
        if (!classRef) {
            throw new Error(`The class '${name}' was not found`);
        }

        let instance = Object.create(classRef.prototype);
        try {
            instance.constructor.apply(instance, ...args);
            // console.log("try.....")
        } catch (err) {
            /**
             * For ES2015(ES6): constructor.apply is not allowed
             */
            // console.log("try catch.....", /Class constructor/.test(err.toString()))
            // console.log("try catch.....>", err.toString())
            if (/Class constructor/.test(err.toString())) {
                instance = class extends classRef {
                    constructor(...params: any[]) {
                        // console.log("params====>", ...params)
                        super(...params);
                    }
                };

                return <T>new instance(...args);
            }
        }

        return <T>instance;
    }
}
