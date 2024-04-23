export interface Department {
    id: string;
    name: string;
    facultyId: string;
}

export interface CreateDepartment {
  name: string;
  facultyId: string;
}
