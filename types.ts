interface TableProps {
  firstName: string;
  lastName: string;
  userEmail: string;
  age: string;
  salary: string;
  department: string;
}

interface FormProps {
  firstName: string;
  lastName: string;
  userEmail?: string;
  gender: "Male" | "Female" | "Other";
  userNumber?: string;
  dateOfBirthInput?: string;
  subjectsInput?: string;
  hobbies?: "Sports" | "Reading" | "Music";
  pictire?: boolean;
  "Current Address"?: string;
}
