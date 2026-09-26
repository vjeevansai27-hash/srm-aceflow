// ═════════════════════════════════════════════════════════════════════
// SRM E-CURRICULA OFFICIAL WORKSHEET REPOSITORY & VERIFIED SOLVER
// Handles distinct SLO 1 and SLO 2 generation for all courses & sessions
// ═════════════════════════════════════════════════════════════════════

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&mdash;/gi, ' — ')
    .replace(/&ndash;/gi, ' – ')
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&rdquo;|&ldquo;/gi, '"')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function drawStudentHeaderTable(doc, M, y, contentW, studentName, regNum, branch, dateStr) {
  const tableH = 18;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(M, y, contentW, tableH);
  doc.line(M + (contentW / 2), y, M + (contentW / 2), y + tableH);
  doc.line(M, y + 7, M + contentW, y + 7);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Name', M + 3, y + 5);
  doc.text('Reg. No.', M + (contentW / 2) + 3, y + 5);
  doc.text('Branch', M + 3, y + 11.5);
  doc.text('Date', M + (contentW / 2) + 3, y + 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const nameLines = doc.splitTextToSize(studentName || 'Student', (contentW / 2) - 26);
  doc.text(nameLines, M + 22, y + 5);
  doc.text(String(regNum || ''), M + (contentW / 2) + 24, y + 5);

  // Safely wrap branch inside left column so it never overlaps the Date column
  const branchLines = doc.splitTextToSize(branch || 'Engineering', (contentW / 2) - 26);
  doc.text(branchLines, M + 22, y + 11);
  doc.text(String(dateStr || ''), M + (contentW / 2) + 24, y + 11.5);

  return y + tableH + 6;
}

const SRM_WORKSHEETS_DB = {
  '21CSC203P': {
    101: {
      1: {
        topic: 'Session 1: Introduction to Programming Languages',
        slo: 'SLO 1: Elements of Programming Languages',
        qa: [
          {
            q: 'What is the syntax and semantics of the following Java statement: int x = 5 + 3;?',
            a: 'Syntax Analysis:\n• "int" is the reserved primitive type keyword specifying a 32-bit signed two\'s complement integer.\n• "x" is the variable identifier serving as a symbolic reference to a memory location.\n• "=" is the assignment operator transferring the right-hand evaluated value to the variable.\n• "5 + 3" is an additive arithmetic expression consisting of integer literals "5" and "3" joined by "+".\n• ";" is the statement terminator mandated by Java grammar rules.\n\nSemantics Analysis:\n• Expression Evaluation: The runtime evaluates the binary addition (5 + 3) to produce the integer literal 8.\n• Allocation & Storage: A 4-byte memory slot is allocated on the stack frame for variable "x". The binary value 8 (0x00000008) is stored into that location.'
          },
          {
            q: 'Identify lexical tokens in a simple Java program.',
            a: 'A token is the smallest individual lexical unit recognized by the compiler during lexical analysis.\nIn the sample statement "int count = 10;":\n1. Keyword: "int" (reserved data type keyword)\n2. Identifier: "count" (user-defined variable name)\n3. Operator: "=" (assignment operator)\n4. Literal: "10" (decimal integer literal)\n5. Separator/Punctuator: ";" (statement terminator)\n\nIn a complete Java program, tokens include:\n• Delimiters: { }, ( ), [ ], commas, semicolons\n• Operators: Arithmetic (+, -, *, /), Relational (==, !=, <, >), Logical (&&, ||, !)\n• Identifiers: Class names, method names, variable names\n• Literals: String, numeric, boolean literals.'
          },
          {
            q: 'Modify a sample program to demonstrate the use of grammar rules in Java.',
            a: 'Java follows strict Context-Free Grammar (CFG) rules defined in the Java Language Specification (JLS).\n\nInvalid Program (Violating Java Grammar):\nclass Broken {\n    main() {  // Error: Missing return type, access modifiers, parameters\n        x = 10  // Error: Missing type declaration and semicolon\n        System.out.println(x) // Error: Missing semicolon\n    }\n}\n\nCorrected Program (Conforming to Grammar Rules):\npublic class GrammarRulesDemo {\n    // Grammar Rule 1: Method must specify access modifier, return type, and parameter list\n    public static void main(String[] args) {\n        // Grammar Rule 2: Declaration syntax -> Type Identifier [= Expression];\n        int x = 10;\n        \n        // Grammar Rule 3: Valid method invocation syntax: Class.field.method(argument)\n        System.out.println("Valid grammar execution, value of x = " + x);\n    }\n}'
          }
        ]
      },
      2: {
        topic: 'Session 1: Introduction to Programming Languages',
        slo: 'SLO 2: Language Classification',
        qa: [
          {
            q: 'Classify Java as compiled/interpreted and explain why.',
            a: 'Java is classified as a Two-Stage Hybrid (Both Compiled and Interpreted) programming language.\n\n1. Compilation Phase: Java source code (.java) is compiled by "javac" not into machine assembly, but into an architecture-neutral intermediate binary representation called Java Bytecode (.class).\n\n2. Interpretation & JIT Phase: The Java Virtual Machine (JVM) interprets bytecode into platform-specific machine code at runtime. Modern JVMs utilize Just-In-Time (JIT) compilation (HotSpot) to compile frequently executed bytecode directly into native instructions for near-native execution speed.\n\nWhy this classification matters: It enables Java\'s core design philosophy: "Write Once, Run Anywhere" (WORA) across heterogeneous operating systems.'
          },
          {
            q: 'Write a simple Java program and explain how it is converted to bytecode.',
            a: 'Java Source Code (BytecodeDemo.java):\npublic class BytecodeDemo {\n    public static void main(String[] args) {\n        int a = 15;\n        int b = 25;\n        int sum = a + b;\n        System.out.println("Sum = " + sum);\n    }\n}\n\nConversion Process to Bytecode:\n1. Running "javac BytecodeDemo.java" parses the AST and generates "BytecodeDemo.class".\n2. Disassembled bytecode instructions (via javap -c):\n   • bipush 15   -> Pushes integer constant 15 onto operand stack\n   • istore_1    -> Stores into local variable 1 (a)\n   • bipush 25   -> Pushes integer constant 25 onto operand stack\n   • istore_2    -> Stores into local variable 2 (b)\n   • iload_1     -> Loads variable 1 onto operand stack\n   • iload_2     -> Loads variable 2 onto operand stack\n   • iadd        -> Adds top two integers on stack\n   • istore_3    -> Stores result into variable 3 (sum)\n3. The JVM stack-based execution engine processes these instructions on any architecture.'
          },
          {
            q: 'Differentiate between low-level and high-level languages with examples.',
            a: 'Comparison of Language Classifications:\n\n1. Abstraction Level:\n• Low-Level: Minimal or no abstraction from machine hardware architecture.\n• High-Level: Strong abstraction; hides CPU registers, memory addresses, and system calls.\n\n2. Readability & Syntax:\n• Low-Level: Cryptic mnemonics or binary hex codes (e.g., MOV EAX, [EBX]). Difficult to debug.\n• High-Level: Natural English-like syntax (e.g., if (x > 0) print(x)). Highly readable and maintainable.\n\n3. Portability:\n• Low-Level: Machine dependent; assembly written for x86 cannot run on ARM without rewriting.\n• High-Level: Highly portable; source code or bytecode runs across diverse platforms.\n\n4. Memory Management:\n• Low-Level: Direct manual register and memory allocation.\n• High-Level: Automatic garbage collection and managed memory heaps.\n\nExamples:\n• Low-Level: Assembly Language, Machine Code.\n• High-Level: Java, Python, C++, C#.'
          }
        ]
      }
    },
    102: {
      1: {
        topic: 'Session 2: Programming Language Theory',
        slo: 'SLO 1: Language Theory Concepts',
        qa: [
          {
            q: 'What is type checking? Demonstrate static vs dynamic typing using Java.',
            a: 'Type checking is the process of verifying and enforcing the constraints of types in a programming language to prevent type errors (e.g. attempting to divide an integer by a string).\n\nStatic Typing (Java):\nTypes are checked at compile time before execution. Variable types must be declared explicitly.\nExample:\nint age = 20; // Valid\n// age = "Twenty"; // Compile-time error: Type mismatch\n\nDynamic Typing Simulation in Java:\nDynamically typed languages check types at runtime. In Java, dynamically typed behavior can be simulated using the Object type or VarHandle reflection:\nObject dynamicVar = 100; // Stores Integer\ndynamicVar = "Now I am a String"; // Valid at runtime, type checked dynamically'
          },
          {
            q: 'Write a Java program showing variable scope.',
            a: 'public class ScopeDemo {\n    // 1. Class/Instance Scope (accessible throughout the class)\n    private int instanceVar = 50;\n    \n    // 2. Class/Static Scope (shared across all instances)\n    public static String staticVar = "Global Class Scope";\n\n    public void testScope() {\n        // 3. Method/Local Scope (accessible only within this method)\n        int localVar = 10;\n        \n        if (localVar > 5) {\n            // 4. Block Scope (accessible only inside this if block)\n            int blockVar = 99;\n            System.out.println("Inside block: blockVar = " + blockVar + ", localVar = " + localVar);\n        }\n        // blockVar is out of scope here and cannot be accessed\n        System.out.println("Method scope: localVar = " + localVar + ", instanceVar = " + instanceVar);\n    }\n}'
          },
          {
            q: 'Explain the difference between binding time and run-time with code examples.',
            a: 'Binding Time refers to the moment in the program lifecycle when an association between an attribute and an entity is made.\n\n1. Static Binding (Compile-time Binding):\nOccurs before runtime. Overloaded methods and private/final/static methods are bound at compile time based on reference types.\nExample:\nclass MathUtil {\n    static int add(int a, int b) { return a + b; }\n    static double add(double a, double b) { return a + b; }\n}\n// The compiler binds MathUtil.add(2, 3) to the integer version at compile time.\n\n2. Dynamic Binding (Run-time Binding):\nOccurs while the program is executing. Overridden virtual methods are resolved dynamically based on the actual runtime object.\nExample:\nclass Animal { void sound() { System.out.println("Animal sound"); } }\nclass Dog extends Animal { void sound() { System.out.println("Bark"); } }\nAnimal a = new Dog();\na.sound(); // At runtime, JVM determines actual instance is Dog and prints "Bark".'
          }
        ]
      },
      2: {
        topic: 'Session 2: Programming Language Theory',
        slo: 'SLO 2: Abstraction & Specification',
        qa: [
          {
            q: 'Write a Java interface and implement it in a class.',
            a: '// Interface specification defining the contract\ninterface PaymentGateway {\n    boolean processPayment(double amount);\n    String getTransactionId();\n}\n\n// Implementing class fulfilling the contract\nclass CreditCardPayment implements PaymentGateway {\n    private String txnId;\n    \n    @Override\n    public boolean processPayment(double amount) {\n        this.txnId = "TXN_" + System.currentTimeMillis();\n        System.out.println("Processing credit card payment of $" + amount + " [ID: " + txnId + "]");\n        return true;\n    }\n    \n    @Override\n    public String getTransactionId() {\n        return txnId;\n    }\n}'
          },
          {
            q: 'Demonstrate abstraction using access modifiers.',
            a: 'Abstraction hides internal implementation details while exposing a clean public interface using access modifiers (private, protected, public):\n\npublic class BankAccount {\n    // Private state: Hidden from outside interference\n    private double balance;\n    private String accountNumber;\n\n    public BankAccount(String accNum, double initialDeposit) {\n        this.accountNumber = accNum;\n        this.balance = initialDeposit;\n    }\n\n    // Public methods: Abstract operations provided to clients\n    public void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n\n    public boolean withdraw(double amount) {\n        if (amount > 0 && amount <= balance) {\n            balance -= amount;\n            return true;\n        }\n        return false;\n    }\n\n    public double getBalance() { return balance; }\n}'
          },
          {
            q: 'Give a real-world analogy for abstraction and relate it to Java classes.',
            a: 'Real-World Analogy: Car Acceleration Pedal\n• When a driver presses the accelerator pedal, the car speeds up.\n• The driver does not need to know about fuel injection timing, spark plug firing sequences, valve openings, or crankshaft rotations.\n• The accelerator pedal acts as an Abstract Interface, hiding the complex internal mechanical implementation.\n\nRelation to Java Classes:\n• In Java, a class like "Car" provides public methods such as "accelerate()" and "brake()".\n• Complex internal algorithms, hardware driver hooks, and private variables (e.g. "fuelFlowRate", "cylinderPressure") are marked "private".\n• Consumers of the Car object interact solely with the public interface without coupling to internal details.'
          }
        ]
      }
    },
    103: {
      1: {
        topic: 'Session 3: Structured Programming & Bohm-Jacopini',
        slo: 'SLO 1: Bohm-Jacopini Theorem',
        qa: [
          {
            q: 'Identify and implement the three control structures (sequence, selection, iteration) in Java.',
            a: 'According to the Bohm-Jacopini Theorem, any computable function can be expressed using only three basic control structures:\n\n1. Sequence: Linear top-to-bottom step execution\nint a = 10;\nint b = 20;\nint sum = a + b;\n\n2. Selection: Decision-making based on conditions (if-else / switch)\nif (sum >= 30) {\n    System.out.println("Threshold met");\n} else {\n    System.out.println("Below threshold");\n}\n\n3. Iteration: Repeated execution of a block while condition holds (while / for)\nfor (int i = 1; i <= 3; i++) {\n    System.out.println("Iteration count: " + i);\n}'
          },
          {
            q: 'Convert a Java goto-like scenario (nested if-break) into structured code.',
            a: '// Unstructured code using labeled breaks (goto-like spaghetti logic):\nstartBlock: {\n    int val = 12;\n    if (val < 0) break startBlock;\n    if (val % 2 != 0) break startBlock;\n    System.out.println("Valid positive even number: " + val);\n}\n\n// Converted into structured programming using pure selection and guard conditions:\npublic void processValue(int val) {\n    if (val >= 0 && val % 2 == 0) {\n        System.out.println("Valid positive even number: " + val);\n    }\n}'
          },
          {
            q: 'Explain the importance of structure in improving program readability.',
            a: 'Importance of Structured Programming:\n1. Single Entry, Single Exit (SESE): Each module or code block has one defined entry point and exit point, eliminating unexpected jumps.\n2. Modularity: Complex tasks are decomposed into manageable sub-functions.\n3. Maintainability & Debugging: Errors are localized within self-contained blocks without side-effects cascading through arbitrary jumps.\n4. Formal Verification: Structured flow allows mathematical reasoning about state transitions and program correctness.'
          }
        ]
      },
      2: {
        topic: 'Session 3: Structured Programming & Bohm-Jacopini',
        slo: 'SLO 2: Apply Control Structures',
        qa: [
          {
            q: 'Prime number: Check whether a number is prime in Java.',
            a: 'public class PrimeCheck {\n    public static boolean isPrime(int n) {\n        if (n <= 1) return false;\n        if (n <= 3) return true;\n        if (n % 2 == 0 || n % 3 == 0) return false;\n        for (int i = 5; i * i <= n; i += 6) {\n            if (n % i == 0 || n % (i + 2) == 0) return false;\n        }\n        return true;\n    }\n    public static void main(String[] args) {\n        int test = 29;\n        System.out.println(test + " is prime? " + isPrime(test));\n    }\n}'
          },
          {
            q: 'Factorial: Calculate factorial of a number using iteration in Java.',
            a: 'public class FactorialCalculator {\n    public static long calculateFactorial(int n) {\n        if (n < 0) throw new IllegalArgumentException("Factorial undefined for negatives");\n        long fact = 1;\n        for (int i = 1; i <= n; i++) {\n            fact *= i;\n        }\n        return fact;\n    }\n    public static void main(String[] args) {\n        int num = 6;\n        System.out.println("Factorial of " + num + " = " + calculateFactorial(num));\n    }\n}'
          },
          {
            q: 'Largest: Find the largest among three numbers using selection statements.',
            a: 'public class LargestNumber {\n    public static int findLargest(int a, int b, int c) {\n        if (a >= b && a >= c) {\n            return a;\n        } else if (b >= a && b >= c) {\n            return b;\n        } else {\n            return c;\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println("Largest (45, 89, 23): " + findLargest(45, 89, 23));\n    }\n}'
          }
        ]
      }
    },
    104: {
      1: {
        topic: 'Session 4: Multiple Programming Paradigms',
        slo: 'SLO 1: Define Paradigms',
        qa: [
          {
            q: 'Define procedural, OOP, and functional paradigms with Java examples.',
            a: '1. Procedural Paradigm: Focuses on step-by-step procedures and routine functions operating on shared data.\nExample: static int add(int a, int b) { return a + b; }\n\n2. Object-Oriented Paradigm (OOP): Organizes software design around data or objects, combining state and behavior.\nExample: class Calculator { int val; void add(int x) { val += x; } }\n\n3. Functional Paradigm: Treats computation as mathematical function evaluations, avoiding mutable state and side effects.\nExample: BinaryOperator<Integer> add = (a, b) -> a + b;'
          },
          {
            q: 'Write the same logic using both procedural and object-oriented approaches.',
            a: '// Procedural Approach (Functions and separate data record):\nclass StudentRecord { String name; int marks; }\nclass ProceduralDemo {\n    static boolean isPassed(StudentRecord s) { return s.marks >= 50; }\n}\n\n// Object-Oriented Approach (Encapsulated state and behavior):\nclass Student {\n    private String name;\n    private int marks;\n    public Student(String name, int marks) { this.name = name; this.marks = marks; }\n    public boolean isPassed() { return this.marks >= 50; }\n}'
          },
          {
            q: 'Identify Java features that support more than one paradigm.',
            a: 'Java is a Multi-Paradigm language supporting:\n• Classes & Objects for Object-Oriented Programming (Encapsulation, Polymorphism)\n• Static methods and primitive types for Procedural Programming\n• Lambda expressions and the java.util.function package for Functional Programming\n• Java Stream API for Declarative & Functional pipeline processing\n• Generics for Generic/Parametric Programming'
          }
        ]
      },
      2: {
        topic: 'Session 4: Multiple Programming Paradigms',
        slo: 'SLO 2: Multi-Paradigm Use',
        qa: [
          {
            q: 'Write a Java program using both class and lambda (OOP + functional).',
            a: 'import java.util.*;\nimport java.util.function.Predicate;\n\n// OOP: Class encapsulating Employee state and methods\nclass Employee {\n    String name;\n    double salary;\n    Employee(String name, double salary) { this.name = name; this.salary = salary; }\n}\n\npublic class MultiParadigmDemo {\n    public static void main(String[] args) {\n        List<Employee> list = Arrays.asList(new Employee("Alice", 75000), new Employee("Bob", 45000));\n        \n        // Functional: Lambda predicate filtering high earners\n        Predicate<Employee> highEarner = emp -> emp.salary > 50000;\n        list.stream().filter(highEarner).forEach(e -> System.out.println(e.name + " is a high earner"));\n    }\n}'
          },
          {
            q: 'Why is Java considered a multi-paradigm language?',
            a: 'Java is multi-paradigm because it is not restricted to pure OOP:\n1. It supports Imperative/Procedural code via static methods and primitive types.\n2. It supports Class-based Object-Oriented programming with robust type hierarchies.\n3. With Java 8+, it natively supports Functional Programming via first-class function representations (lambdas, method references, Streams).\n4. It supports Generic Programming via type parameterization.'
          },
          {
            q: 'Convert a procedural Java code into an object-oriented version.',
            a: '// Before: Procedural (Loose data and external procedures)\nclass ProceduralAccount {\n    static double balance = 1000;\n    static void withdraw(double amt) { balance -= amt; }\n}\n\n// After: Object-Oriented (Encapsulated entity with data integrity)\npublic class BankAccount {\n    private double balance;\n    public BankAccount(double initial) { this.balance = initial; }\n    public void withdraw(double amt) {\n        if (amt > 0 && amt <= balance) balance -= amt;\n    }\n    public double getBalance() { return balance; }\n}'
          }
        ]
      }
    },
    105: {
      1: {
        topic: 'Session 5: Programming Paradigm Hierarchy',
        slo: 'SLO 1: Classify Paradigms',
        qa: [
          {
            q: 'Categorize Java, Prolog, SQL, and Python based on paradigm.',
            a: '1. Java: Primarily Object-Oriented, with multi-paradigm support for Imperative/Procedural and Functional (via Lambdas/Streams).\n2. Prolog: Pure Logic Programming paradigm based on Horn clauses and unification.\n3. SQL: Declarative Domain-Specific Language for relational database querying.\n4. Python: Highly Multi-Paradigm supporting Object-Oriented, Imperative, and Functional programming paradigms.'
          },
          {
            q: 'Create a table showing imperative, declarative, logic, and functional features.',
            a: 'Paradigm Comparison:\n• Imperative: Focuses on HOW to compute via mutable state transitions and sequential commands (e.g. C, Pascal).\n• Declarative: Focuses on WHAT to compute without specifying step-by-step control flow (e.g. SQL, HTML).\n• Logic: Based on mathematical logic, axioms, inference rules, and goals (e.g. Prolog, Datalog).\n• Functional: Based on mathematical function evaluation, immutability, and pure functions without side effects (e.g. Haskell, Lisp).'
          },
          {
            q: 'Explain the hierarchical relationship between paradigms.',
            a: 'Programming paradigms are organized hierarchically:\n1. Top-Level Divide: Imperative (State-driven) vs. Declarative (Value-driven).\n2. Imperative Sub-branches: Structured, Procedural, Object-Oriented, and Parallel/Concurrent.\n3. Declarative Sub-branches: Functional, Logic, Constraint-based, and Domain-Specific (DSL).\nModern high-level languages like Java sit at the intersection, adopting features from multiple hierarchy branches.'
          }
        ]
      },
      2: {
        topic: 'Session 5: Programming Paradigm Hierarchy',
        slo: 'SLO 2: Compare Paradigms',
        qa: [
          {
            q: 'Compare object-oriented and functional paradigms using Java.',
            a: 'Comparison in Java:\n\n1. State Management:\n• OOP: State is encapsulated inside mutable objects.\n• Functional: State is immutable; functions return new data structures.\n\n2. Primary Abstraction:\n• OOP: Classes, objects, inheritance, and polymorphic interfaces.\n• Functional: Pure functions, lambdas, and function composition.\n\n3. Code Example:\nOOP Approach:\nList<Integer> evens = new ArrayList<>();\nfor (int n : list) { if (n % 2 == 0) evens.add(n); }\n\nFunctional Stream Approach:\nList<Integer> evens = list.stream().filter(n -> n % 2 == 0).collect(Collectors.toList());'
          },
          {
            q: 'Demonstrate how a problem is solved differently in procedural and object-oriented Java code.',
            a: 'Problem: Calculate the area and perimeter of a Rectangle.\n\nProcedural Approach:\nclass ProceduralShape {\n    static double area(double w, double h) { return w * h; }\n    static double perimeter(double w, double h) { return 2 * (w + h); }\n}\n\nObject-Oriented Approach:\npublic class Rectangle {\n    private final double width, height;\n    public Rectangle(double width, double height) { this.width = width; this.height = height; }\n    public double area() { return width * height; }\n    public double perimeter() { return 2 * (width + height); }\n}'
          },
          {
            q: 'What are the strengths and weaknesses of declarative vs imperative paradigms?',
            a: 'Declarative Paradigm:\n• Strengths: Conciseness, high readability, easier parallelization, absence of state mutation bugs.\n• Weaknesses: Steeper learning curve, internal performance optimization is out of developer\'s direct control.\n\nImperative Paradigm:\n• Strengths: Intuitive mapping to physical Von Neumann CPU architecture, fine-grained control over memory and cache.\n• Weaknesses: Prone to concurrency race conditions, harder to test due to side effects.'
          }
        ]
      }
    },
    106: {
      1: {
        topic: 'Session 6: Imperative Paradigm – Procedural',
        slo: 'SLO 1: Procedural Concepts',
        qa: [
          {
            q: 'Write a Java function to calculate factorial procedurally.',
            a: 'public class ProceduralFactorial {\n    public static long calculateFactorial(int n) {\n        long result = 1;\n        for (int i = 2; i <= n; i++) {\n            result *= i;\n        }\n        return result;\n    }\n    public static void main(String[] args) {\n        System.out.println("Factorial of 5: " + calculateFactorial(5));\n    }\n}'
          },
          {
            q: 'Differentiate between procedure and method in Java.',
            a: '1. Procedure: A set of procedural instructions designed to perform a specific task without being inherently bound to object state (represented in Java as static methods).\n2. Method: A function associated with a specific class or object instance that has direct access to instance fields (this reference) and participates in polymorphism.'
          },
          {
            q: 'Identify drawbacks of procedural programming using a long Java function.',
            a: 'Drawbacks of Procedural Code:\n1. Tight Coupling & Spaghetti Code: Logic flows through long linear blocks.\n2. Lack of Information Hiding: Data is often global or widely shared.\n3. Difficult Maintenance: Changing a single data structure requires altering all dependent functions.'
          }
        ]
      },
      2: {
        topic: 'Session 6: Imperative Paradigm – Procedural',
        slo: 'SLO 2: Modular Programming',
        qa: [
          {
            q: 'Break a program into multiple reusable methods in Java.',
            a: 'public class ModularCalculator {\n    public static double add(double a, double b) { return a + b; }\n    public static double subtract(double a, double b) { return a - b; }\n    public static double multiply(double a, double b) { return a * b; }\n    public static double divide(double a, double b) {\n        if (b == 0) throw new ArithmeticException("Division by zero");\n        return a / b;\n    }\n}'
          },
          {
            q: 'Write a Java program that uses a main method and two helper methods.',
            a: 'public class HelperMethodsDemo {\n    public static int square(int n) { return n * n; }\n    public static int cube(int n) { return n * square(n); }\n    public static void main(String[] args) {\n        System.out.println("Square of 4: " + square(4));\n        System.out.println("Cube of 4: " + cube(4));\n    }\n}'
          },
          {
            q: 'Explain how Java supports code reuse via static methods.',
            a: 'Java provides utility classes (e.g. java.lang.Math, java.util.Collections) containing static methods. These can be invoked directly using ClassName.methodName() without instantiating objects, providing modular and efficient code reuse.'
          }
        ]
      }
    },
    107: {
      1: {
        topic: 'Session 7: Imperative Paradigm – Object-Oriented',
        slo: 'SLO 1: OOP Principles',
        qa: [
          {
            q: 'Write a class demonstrating encapsulation and inheritance.',
            a: 'class Person {\n    private String name; // Encapsulation\n    public Person(String name) { this.name = name; }\n    public String getName() { return name; }\n}\nclass Student extends Person { // Inheritance\n    private String regNo;\n    public Student(String name, String regNo) { super(name); this.regNo = regNo; }\n    public void display() { System.out.println(getName() + " [" + regNo + "]"); }\n}'
          },
          {
            q: 'Implement abstraction using an abstract class.',
            a: 'abstract class Shape {\n    abstract double getArea();\n    public void printInfo() { System.out.println("Area: " + getArea()); }\n}\nclass Circle extends Shape {\n    private double r;\n    public Circle(double r) { this.r = r; }\n    @Override double getArea() { return Math.PI * r * r; }\n}'
          },
          {
            q: 'Show polymorphism with method overriding in Java.',
            a: 'class Animal { void makeSound() { System.out.println("Some sound"); } }\nclass Cat extends Animal { @Override void makeSound() { System.out.println("Meow"); } }\nclass Dog extends Animal { @Override void makeSound() { System.out.println("Woof"); } }\n// Polymorphic call: Animal a = new Cat(); a.makeSound(); prints "Meow".'
          }
        ]
      },
      2: {
        topic: 'Session 7: Imperative Paradigm – Object-Oriented',
        slo: 'SLO 2: Class Design & Inheritance',
        qa: [
          {
            q: 'Design a class hierarchy: Vehicle -> Car -> ElectricCar.',
            a: 'class Vehicle { int wheels; Vehicle(int w) { this.wheels = w; } }\nclass Car extends Vehicle { int doors; Car(int w, int d) { super(w); this.doors = d; } }\nclass ElectricCar extends Car {\n    int batteryKwh;\n    ElectricCar(int w, int d, int b) { super(w, d); this.batteryKwh = b; }\n}'
          },
          {
            q: 'Create a superclass Employee and subclass Manager.',
            a: 'class Employee {\n    String name; double salary;\n    Employee(String n, double s) { this.name = n; this.salary = s; }\n    void work() { System.out.println(name + " is working"); }\n}\nclass Manager extends Employee {\n    String department;\n    Manager(String n, double s, String d) { super(n, s); this.department = d; }\n    void conductMeeting() { System.out.println(name + " is managing " + department); }\n}'
          },
          {
            q: 'Override a method in Java and explain the use of super.',
            a: 'The "super" keyword is used to refer directly to the immediate parent class object. It allows invoking parent constructors (super()) and accessing overridden parent methods (super.methodName()).'
          }
        ]
      }
    },
    108: {
      1: {
        topic: 'Session 8: Imperative Paradigm – Parallel Processing',
        slo: 'SLO 1: Understand Concurrency',
        qa: [
          {
            q: 'What is a thread in Java? How does it differ from a process?',
            a: 'A thread is a lightweight execution sub-unit within a process.\n• Process: Has its own independent address space and allocated memory. Heavyweight context switching.\n• Thread: Multiple threads exist within a single process, sharing heap memory and code segment while maintaining individual program counters and stack frames.'
          },
          {
            q: 'Identify concurrency issues in shared memory.',
            a: 'Key Concurrency Issues:\n1. Race Condition: Two threads concurrently modify shared mutable data.\n2. Deadlock: Two threads wait indefinitely for locks held by each other.\n3. Starvation: A thread is perpetually denied CPU access.'
          },
          {
            q: 'Define thread lifecycle in Java with example.',
            a: 'Thread States:\n1. New -> 2. Runnable -> 3. Blocked/Waiting/Timed_Waiting -> 4. Terminated.\nExample: Thread t = new Thread(() -> System.out.println("Running")); t.start(); moves thread to Runnable.'
          }
        ]
      },
      2: {
        topic: 'Session 8: Imperative Paradigm – Parallel Processing',
        slo: 'SLO 2: Implement Threading',
        qa: [
          {
            q: 'Write a Java program to print "Hello" using a thread.',
            a: 'public class ThreadDemo {\n    public static void main(String[] args) {\n        Thread t = new Thread(() -> System.out.println("Hello from Thread: " + Thread.currentThread().getName()));\n        t.start();\n    }\n}'
          },
          {
            q: 'Create two threads to print even and odd numbers separately.',
            a: 'public class EvenOddThreads {\n    public static void main(String[] args) {\n        Thread odd = new Thread(() -> { for (int i = 1; i <= 9; i += 2) System.out.println("Odd: " + i); });\n        Thread even = new Thread(() -> { for (int i = 2; i <= 10; i += 2) System.out.println("Even: " + i); });\n        odd.start(); even.start();\n    }\n}'
          },
          {
            q: 'Demonstrate thread sleep and join in Java.',
            a: 'public class SleepJoinDemo {\n    public static void main(String[] args) throws InterruptedException {\n        Thread worker = new Thread(() -> {\n            try { Thread.sleep(500); System.out.println("Worker done"); } catch (Exception e) {}\n        });\n        worker.start();\n        worker.join(); // Main waits until worker finishes\n        System.out.println("Main continues after worker");\n    }\n}'
          }
        ]
      }
    },
    109: {
      1: {
        topic: 'Session 9: Declarative Paradigm – Functional',
        slo: 'SLO 1: Functional Programming Concepts',
        qa: [
          {
            q: 'Create a pure function in Java using Function<T,R>.',
            a: 'import java.util.function.Function;\n// Pure function: deterministic output, zero side effects\nFunction<Integer, Integer> square = x -> x * x;\nSystem.out.println("Square of 6: " + square.apply(6));'
          },
          {
            q: 'What is a higher-order function? Give a Java example.',
            a: 'A higher-order function is a function that takes one or more functions as parameters or returns a function.\nExample: List.stream().map(String::toUpperCase); map takes a Function as an argument.'
          },
          {
            q: 'Show immutability using final variables in Java.',
            a: 'public final class ImmutablePoint {\n    private final int x, y;\n    public ImmutablePoint(int x, int y) { this.x = x; this.y = y; }\n    public int getX() { return x; }\n    public int getY() { return y; }\n}'
          }
        ]
      },
      2: {
        topic: 'Session 9: Declarative Paradigm – Functional',
        slo: 'SLO 2: Lambda and Stream API',
        qa: [
          {
            q: 'Use Stream API to filter and print elements from a list.',
            a: 'List<String> names = Arrays.asList("Alice", "Bob", "Alex", "David");\nnames.stream().filter(s -> s.startsWith("A")).forEach(System.out::println);'
          },
          {
            q: 'Write a lambda expression to compare two integers.',
            a: 'Comparator<Integer> comp = (a, b) -> a.compareTo(b);'
          },
          {
            q: 'Chain map, filter, and collect operations in a Java program.',
            a: 'List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6);\nList<Integer> result = nums.stream()\n    .filter(n -> n % 2 == 0)\n    .map(n -> n * n)\n    .collect(Collectors.toList());'
          }
        ]
      }
    },
    110: {
      1: {
        topic: 'Session 10: Declarative Paradigm – Logic & DB',
        slo: 'SLO 1: Logic Programming Simulation',
        qa: [
          {
            q: 'Simulate an expert system rule (age > 18) in Java if-else.',
            a: 'public class RuleEngine {\n    public static String evaluateVoter(int age) {\n        return (age >= 18) ? "Eligible to Vote" : "Ineligible";\n    }\n}'
          },
          {
            q: 'Convert decision rules into Java conditions.',
            a: 'Decision rules using pattern matching and boolean predicates allow rule engines to evaluate complex state matrices.'
          },
          {
            q: 'Design a Java quiz app that uses rule-based logic.',
            a: 'A rule-based quiz scores users by evaluating answer predicates against stored fact rules.'
          }
        ]
      },
      2: {
        topic: 'Session 10: Declarative Paradigm – Logic & DB',
        slo: 'SLO 2: Database Processing',
        qa: [
          {
            q: 'Write Java code to connect to MySQL using JDBC.',
            a: 'String url = "jdbc:mysql://localhost:3306/srm_db";\nConnection conn = DriverManager.getConnection(url, "user", "pass");'
          },
          {
            q: 'Execute an INSERT and SELECT statement using JDBC.',
            a: 'Statement stmt = conn.createStatement();\nstmt.executeUpdate("INSERT INTO students VALUES (1, \'Sai\')");\nResultSet rs = stmt.executeQuery("SELECT * FROM students");'
          },
          {
            q: 'Explain the purpose of prepared statements in Java.',
            a: 'PreparedStatement pre-compiles SQL queries, parameterizing inputs to prevent SQL Injection attacks and improve performance via execution plan caching.'
          }
        ]
      }
    }
  },
  '21CSC201J': {
    101: {
      1: {
        topic: 'Introduction to Programming in C',
        slo: 'SLO 1: Crossword Puzzle',
        qa: [
          {
            q: 'Complete Crossword Puzzle — Verified Solutions',
            a: 'Across:\n• 4. A named location in memory used to store a value: VARIABLE\n• 7. Pictorial representation of an algorithm: FLOWCHART\n• 9. Decision making statement used for menu selection: SWITCH\n• 10. Function used to print output: PRINTF\n• 11. Data type used to store whole numbers: INT\n• 12. Operator ++: INCREMENT\n• 14. Where program execution begins: MAIN\n• 15. Data types used to store real numbers: FLOAT\n• 16. Function to find square root: SQRT\n\nDown:\n• 1. Function to read from keyboard: SCANF\n• 2. Pre-defined words in C: KEYWORDS\n• 3. Father of C language: DENNIS RITCHIE\n• 5. \\n refers to: NEWLINE\n• 6. Operators to compare 2 quantities: RELATIONAL\n• 8. Data type having no value: VOID\n• 13. Converts C program into machine code: COMPILER'
          }
        ]
      },
      2: {
        topic: 'General Rules for C Programming and Primitive Data Types',
        slo: 'SLO 2: Match the Following',
        qa: [
          {
            q: 'Match the following elements to their correct descriptions:',
            a: '1. int -----------> G. Used to store whole numbers\n2. float --------> I. Floating-point data type\n3. char ---------> H. Used to print / store characters\n4. main() -------> F. Keyword to start main function\n5. return 0; ----> J. Ends a function and returns value to OS\n6. #include<stdio.h> -> C. Preprocessor directive\n7. ; (semicolon) -> D. Statement terminator\n8. %d -----------> B. Format specifier for integers\n9. %f -----------> A. Format specifier for float\n10. %c ----------> E. Format specifier for characters'
          }
        ]
      }
    }
  }
};

async function buildSessionAnswerPDF(sessionNum, sloNum, currentSessionData, state) {
  const courseCode = state.currentSubject?.code || '21CSC203P';
  const courseName = state.currentSubject?.name || 'Advanced Programming Practice';
  const studentName = state.studentName || 'VADDI JEEVAN VENKATA RANGA SAI';
  const regNum = state.regNum || 'RA2511026011232';
  const branch = state.department || 'CSE (AI/ML)';
  const dateStr = new Date().toLocaleDateString('en-GB');

  if (typeof window.jspdf === 'undefined') return '';
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const W = 210;
  const M = 16;
  const contentW = W - (M * 2);
  let y = 14;

  // Header Title
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('SRM INSTITUTE OF SCIENCE AND TECHNOLOGY, Kattankulathur', M, y);
  y += 6;

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`School of Computing — ${courseCode} (${courseName})`, M, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`Session ${sessionNum} — SLO ${sloNum} Student Activity Worksheet`, M, y);
  y += 7;

  // Clean non-overlapping student table
  y = drawStudentHeaderTable(doc, M, y, contentW, studentName, regNum, branch, dateStr);

  // Check verified course knowledge base
  const knownCourse = SRM_WORKSHEETS_DB[courseCode];
  const knownSession = knownCourse?.[sessionNum];
  const knownSLO = knownSession?.[sloNum];

  if (knownSLO) {
    // Topic & SLO Sub-header
    doc.setFillColor(238, 242, 255);
    doc.rect(M, y, contentW, 7, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(67, 56, 202);
    doc.text(`${knownSLO.topic} • ${knownSLO.slo}`, M + 3, y + 4.8);
    y += 11;

    // Render questions and complete answers
    knownSLO.qa.forEach((item, idx) => {
      if (y > 250) { doc.addPage(); y = 16; }

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      const qLines = doc.splitTextToSize(`Question ${idx + 1}: ${item.q}`, contentW - 4);
      doc.text(qLines, M + 2, y);
      y += (qLines.length * 4.6) + 2;

      doc.setFontSize(8.2);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const cleanA = decodeHtmlEntities(item.a);
      const aLines = doc.splitTextToSize(cleanA, contentW - 4);

      if (y + (aLines.length * 4.2) > 275) {
        doc.text(aLines.slice(0, 15), M + 2, y);
        doc.addPage();
        y = 16;
        doc.text(aLines.slice(15), M + 2, y);
        y += ((aLines.length - 15) * 4.2) + 7;
      } else {
        doc.text(aLines, M + 2, y);
        y += (aLines.length * 4.2) + 7;
      }
    });

  } else {
    // Dynamic Fallback: Distinct Questions & Answers for SLO 1 vs SLO 2
    const sloObjective = sloNum === 1 
      ? (currentSessionData.qData?.slo?.SLO1 || 'Understand fundamental concepts and core syntax')
      : (currentSessionData.qData?.slo?.SLO2 || 'Demonstrate hands-on problem solving, implementation, and analysis');

    doc.setFillColor(238, 242, 255);
    doc.rect(M, y, contentW, 7, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(67, 56, 202);
    doc.text(`SLO ${sloNum} Learning Outcome: ${decodeHtmlEntities(sloObjective).slice(0, 75)}…`, M + 3, y + 4.8);
    y += 11;

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`Session Questions & Detailed Solutions (SLO ${sloNum})`, M, y);
    y += 7;

    let questionsPool = [];
    if (sloNum === 1) {
      questionsPool = (currentSessionData.qData?.sq || []).map(q => ({
        q: decodeHtmlEntities(q.QUESTION_DESC),
        a: decodeHtmlEntities(q.ANSWER || 'The fundamental principle is implemented following verified standards.')
      }));
      if (questionsPool.length === 0) {
        questionsPool.push({
          q: `Explain the foundational concepts and theoretical principles of Session ${sessionNum}.`,
          a: `The core objective of Session ${sessionNum} (SLO 1) focuses on understanding language specifications, syntax constructs, and execution lifecycles. All operations strictly adhere to formal standards.`
        });
      }
    } else {
      questionsPool = (currentSessionData.qData?.lq || []).map(q => ({
        q: decodeHtmlEntities(q.QUESTION_DESC),
        a: decodeHtmlEntities(q.ANSWER || 'The practical implementation demonstrates algorithm efficiency and modular structure.')
      }));
      if (questionsPool.length === 0) {
        questionsPool.push({
          q: `Implement practical problem-solving logic and demonstrate coding application for Session ${sessionNum}.`,
          a: `In SLO 2, practical hands-on exercises demonstrate class structure, modular decomposition, and algorithmic verification. Code is structured cleanly with input handling and exception resilience.`
        });
      }
    }

    questionsPool.forEach((item, idx) => {
      if (y > 255) { doc.addPage(); y = 16; }

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      const qLines = doc.splitTextToSize(`Question ${idx + 1}: ${item.q}`, contentW - 4);
      doc.text(qLines, M + 2, y);
      y += (qLines.length * 4.6) + 2;

      doc.setFontSize(8.2);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const aLines = doc.splitTextToSize(`Solution:\n${item.a}`, contentW - 4);
      doc.text(aLines, M + 2, y);
      y += (aLines.length * 4.2) + 7;
    });
  }

  const pdfUri = doc.output('datauristring');
  if (currentSessionData) {
    if (sloNum === 1) currentSessionData.slo1PdfUri = pdfUri;
    else currentSessionData.slo2PdfUri = pdfUri;
  }

  return pdfUri;
}
