import { PEOPLE } from "@/data/people";

/** Per-person contact table, rendered from src/data/people.ts. */
export function PeopleTable({ headingId }: { headingId: string }) {
  return (
    <div className="table-scroll" role="region" aria-labelledby={headingId} tabIndex={0}>
      <table>
        <caption className="visually-hidden">People, roles and contact details</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">GitHub</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          {PEOPLE.map((person) => (
            <tr key={person.github}>
              <th scope="row">{person.name}</th>
              <td>{person.roles.join(", ")}</td>
              <td>
                <a href={`https://github.com/${person.github}`}>@{person.github}</a>
              </td>
              <td>{person.email ? <a href={`mailto:${person.email}`}>{person.email}</a> : <span className="muted">Email coming soon</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
