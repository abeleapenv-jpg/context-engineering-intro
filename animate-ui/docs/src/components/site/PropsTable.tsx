/*
 * PropsTable - accessible reference table for the Props API tab.
 */
import type { ApiDoc } from '../../content/api';

export function PropsTable({ doc }: { doc: ApiDoc }) {
  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Props reference</caption>
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th scope="col" className="px-4 py-2.5 font-medium">
                Prop
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Type
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Default
              </th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {doc.props.map((row) => (
              <tr
                key={row.name}
                className="border-b border-border align-top last:border-0"
              >
                <td className="px-4 py-2.5 font-mono text-[13px] text-foreground">
                  {row.name}
                </td>
                <td className="px-4 py-2.5 font-mono text-[13px] text-muted-foreground">
                  {row.type}
                </td>
                <td className="px-4 py-2.5 font-mono text-[13px] text-muted-foreground">
                  {row.defaultValue}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {doc.note ? (
        <p className="mt-3 text-xs text-muted-foreground">{doc.note}</p>
      ) : null}
    </div>
  );
}
