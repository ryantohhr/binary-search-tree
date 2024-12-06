const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

function mergeSort(array) {
    if (array.length === 1) {
        return array;
    }
    else if (array.length === 2) {
        if (array[0] > array[1]) {
            const temp = array[1];
            array[1] = array[0];
            array[0] = temp;
        }
        return array;
    }
    else {
        const mid = Math.floor(array.length / 2);
        // Sort left
        const left = mergeSort(array.slice(0, mid));
    
        // Sort right
        const right = mergeSort(array.slice(mid, array.length));
    
        // Merge
        return merge(left, right);
    }
    
}

function merge(left, right) {
    const array = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            array.push(left[i]);
            i++;
        } else {
            array.push(right[j]);
            j++;
        }
    }

    while (left[i]) {
        array.push(left[i]);
        i++;
    }
    while (right[j]) {
        array.push(right[j]);
        j++;
    }
    return array;
}

class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(array) {
        this.root = this.buildTree(array);
    }

    buildTree(array) {
        array = mergeSort(array);
        let seen = [];
        for (let i = 0; i < array.length; i++) {
            if (seen.includes(array[i])) {
                array.splice(i, 1);
            }
            seen.push(array[i]);
        }
        
        const root = this.arrayToTree(array, 0, array.length - 1);
        return root;
    }

    arrayToTree(array, start, end) {
        if (start > end) {
            return null;
        }
        const mid = start + Math.floor((end - start) / 2);
        const root = new Node(array[mid]);
        root.left = this.arrayToTree(array, start, mid - 1);
        root.right = this.arrayToTree(array, mid + 1, end);

        return root;
    }

    insert(value) {
        const node = new Node(value);
        let currentNode = this.root;
        while (currentNode.right || currentNode.left) {
            if (value > currentNode.data) {
                if (currentNode.right) {
                    currentNode = currentNode.right;
                } else {
                    currentNode.right = node;
                    return;
                }                
            } else {
                if (currentNode.left) {
                    currentNode = currentNode.left;
                } else {
                    currentNode.left = node;
                    return;
                }     
            }
        }
        if (value > currentNode.data) {
            currentNode.right = node;
        } else {
            currentNode.left = node;
        }
    }

    deleteItem(value) {
        this.deleteItemRecursive(this.root, value);
    }

    deleteItemRecursive(root, value) {
        if (root === null) {
            return root;
        }
        if (value > root.data) {
            root.right = this.deleteItem(root.right, value);
        } else if (value < root.data) {
            root.left = this.deleteItem(root.left, value);
        } else {
            if (root.left === null) {
                return root.right;
            }
            if (root.right === null) {
                return root.left;
            }

            let succ = this.getSuccessor(root);
            root.data = succ.data;
            root.right = this.deleteItem(root.right, succ.data);
        }
        return root;
    }

    getSuccessor(currentNode) {
        currentNode = currentNode.right;
        while (currentNode !== null && currentNode.left !== null) {
            currentNode = currentNode.left;
        }
        return currentNode;
    }

    find(value) {
        return this.findRecursive(this.root, value);
    }

    findRecursive(root, value) {
        if (value === root.data) {
            return root;
        } else if (value > root.data) {
            return this.findRecursive(root.right, value);
        } else if (value < root.data) {
            return this.findRecursive(root.left, value);
        }
    }

    levelOrder(callback) {
        if (!callback) {
            throw new Error('No callback');
        }
        const queue = [this.root];
        while (queue[0]) {
            if (queue[0].left) {
                queue.push(queue[0].left);
            }
            if (queue[0].right) {
                queue.push(queue[0].right);
            }
            callback(queue.shift());
        }
    }

    inOrder(callback) {
        if (!callback) {
            throw new Error('No callback');
        }

        this.inOrderRecursive(this.root, callback);
    }

    inOrderRecursive(root, callback) {
        if (root.left === null && root.right) {
            callback(root);
            this.inOrderRecursive(root.right, callback);
            return;
        } else if (root.left === null && root.right === null) {
            callback(root);
            return;
        } else if (root.right && root.left) {
            this.inOrderRecursive(root.left, callback);
            callback(root);
            this.inOrderRecursive(root.right, callback);
        }
    }

    preOrder(callback) {
        if (!callback) {
            throw new Error('No callback');
        }

        callback(this.root);
        this.inOrderRecursive(this.root.left, callback);
        this.inOrderRecursive(this.root.right, callback);
    }

    postOrder(callback) {
        if (!callback) {
            throw new Error('No callback');
        }

        this.inOrderRecursive(this.root.left, callback);
        this.inOrderRecursive(this.root.right, callback);
        callback(this.root);
    }

    height(node) {
        if (!node.right && !node.left) {
            return 0;
        }
        
        let rightHeight = 0;
        let leftHeight = 0;

        if (node.right) {
            rightHeight = this.height(node.right);
        }

        if (node.left) {
            leftHeight = this.height(node.left);
        }

        return Math.max(rightHeight, leftHeight) + 1;
    }

    depth(node) {
        let currentNode = this.root;
        let count = 0;
        while (true) {
            if (currentNode.data === node.data) {
                return count;
            } else if (currentNode.data < node.data && currentNode.right) {
                currentNode = currentNode.right;
                count++;
            } else if (currentNode.data > node.data && currentNode.left) {
                currentNode = currentNode.left;
                count++;
            }
        }
    }

    isBalanced() {
        const rightHeight = this.height(this.root.right);
        const leftHeight = this.height(this.root.left);
        const diff = rightHeight - leftHeight;

        if (diff >= -1 && diff <= 1) {
            return true;
        } else {
            return false;
        }
    }

    rebalance() {
        const newArray = [];
        this.rebalancePush(this.root, newArray);


        this.root = this.buildTree(newArray);
    }

    rebalancePush(root, array) {
        if (root.left === null && root.right) {
            array.push(root.data);
            this.rebalancePush(root.right, array);
            return;
        } else if (root.left === null && root.right === null) {
            array.push(root.data);
            return;
        } else if (root.right && root.left) {
            this.rebalancePush(root.left, array);
            array.push(root.data);
            this.rebalancePush(root.right, array);
        }
    }
}

const unsortedArray = [1, 7, 4, 23, 8, 9, 3, 5, 67, 6345, 324];
const sortedArray = [1, 3, 4, 5, 7, 8, 9, 23, 67, 324, 6345];

function print(node) {
    console.log(node.data);
}

const tree = new Tree(unsortedArray);
console.log(tree.isBalanced());
tree.inOrder(print);
tree.preOrder(print);
tree.postOrder(print);
tree.insert(70);
tree.insert(400);
tree.insert(50000);
tree.insert(60000);
console.log(tree.isBalanced());
tree.rebalance();
console.log(tree.isBalanced());
prettyPrint(tree.root);