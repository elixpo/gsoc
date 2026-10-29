import { RoleChips } from "@/components/blocks";
import { PEOPLE, type Person } from "@/data/people";

/** GitHub, email and (where one exists) portfolio links for one person, as chips. */
export function ContactChips({ person, portfolio = false, label }: { person: Person; portfolio?: boolean; label?: string }) {
  return (
    <ul className="chips link-chips" aria-label={label ?? `Contact ${person.name}`}>
      <li>
        <a className="link-chip" href={`https://github.com/${person.github}`}>
          <span className="link-chip-kind">GitHub</span> @{person.github}
        </a>
      </li>
      <li>
        {person.email ? (
          <a className="link-chip" href={`mailto:${person.email}`}>
            <span className="link-chip-kind">Email</span> {person.email}
          </a>
        ) : (
          <span className="link-chip link-chip-muted">Email coming soon</span>
        )}
      </li>
      {portfolio && person.portfolio ? (
        <li>
          <a className="link-chip" href={person.portfolio}>
            <span className="link-chip-kind">Portfolio</span> {person.portfolio.replace(/^https:\/\//, "")}
          </a>
        </li>
      ) : null}
    </ul>
  );
}

/** Per-person contact table, rendered from src/data/people.ts. Stacks into labelled rows on narrow screens. */
export function PeopleTable({ headingId }: { headingId: string }) {
  return (
    <div className="table-scroll people-table" role="region" aria-labelledby={headingId} tabIndex={0}>
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
              <td>
                <span className="cell-label" aria-hidden="true">Role</span>
                <RoleChips roles={person.roles} label={`Roles of ${person.name}`} />
              </td>
              <td>
                <span className="cell-label" aria-hidden="true">GitHub</span>
                <a className="link-chip" href={`https://github.com/${person.github}`}>
                  @{person.github}
                </a>
              </td>
              <td>
                <span className="cell-label" aria-hidden="true">Email</span>
                {person.email ? (
                  <a className="link-chip" href={`mailto:${person.email}`}>
                    {person.email}
                  </a>
                ) : (
                  <span className="muted">Email coming soon</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
