
export const mathService = {

    getFibonacci: async(n) => {
        if (n < 0) {
            throw new Error("Input must be a non-negative integer.");
        }
        if (n === 0) return 0;
        if (n === 1) return 1;
        
        let a = 0, b = 1, temp;
        
        for (let i = 2; i <= n; i++) {
            temp = a + b;
            a = b;
            b = temp;
            
            if (i % 10000 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        
        return b;
    },
    
    multiplyMatrices: async (a, b) => {
        if (a[0].length !== b.length) {
            throw new Error("Incompatible matrix dimensions for multiplication.");
        }
        
        const result = Array.from({ length: a.length }, () => Array(b[0].length).fill(0));
        
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b[0].length; j++) {
                for (let k = 0; k < a[0].length; k++) {
                    result[i][j] += a[i][k] * b[k][j];
                }
                
                if ((i * b[0].length + j) % 1000 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }
        }
        
        return result;
    }
    
}