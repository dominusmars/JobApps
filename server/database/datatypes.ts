export type application = {
    id:string
    company:string,
    position:string,
    job_type:job_type,
    description:string,
    location:string,
    url: string |"null",
    username:string |"null",
    password:string |"null",
    dateExpire:string |"null",
    dateCreated:string,
    status: status
}

export type applicationRequest = {
    company:string,
    position:string,
    job_type:job_type,
    description:string,
    location:string,
    url: string| null |undefined,
    username:string | null |undefined,
    password:string| null |undefined,
    dateExpire:string| null |undefined,
}
type job_type = "part time" | "full time" | "internship";
type status = "created" |"pending" | "rejected" | "accepted" | "in review" | "interview"