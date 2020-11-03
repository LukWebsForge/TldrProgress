package html

import (
	"fmt"
	"html/template"
	"tldr-translation-progress/lib/tldr"
)

const htmlTable = `
{{ define "table" -}}
<table class="text-center border-opacity-50 mx-auto">
<thead class="sticky top-0 bg-gradient-to-b from-white via-white">
	<tr>
	<th class="px-2 py-4 border border-gray-400">page</th>
	{{- range $lang := .Languages -}}
		<th class="px-2 py-4 border border-gray-400">{{- $lang -}}</th>
	{{- end -}}
	</tr>
</thead>
<tbody class="text-sm">
{{- range $os := .Os -}}
	<tr class="border border-gray-400 bg-teal-200 p-4">
		<th class="text-base px-1 py-2" id="{{ $os }}">{{- $os -}}</th>
		{{- range $lang := $.Languages -}}
			<td class="px-1 py-2">{{ index $.Progress $os $lang | print_percentage }}</td>
		{{- end -}}
	</tr>
	{{- range $name := (index $.Names $os) -}}
		<tr class="border border-gray-400">
			<td class="text-left text-base p-1">{{- $name -}}</td>
			{{- range $lang := $.Languages -}}
				{{- index $.Status $os $name $lang | status2html -}}
			{{- end -}}
		</tr>
	{{- end -}}
{{- end -}}
</tbody>
</table>
{{- end }}
`

// Converts a status (of the type tldr.StatusEnum) into single html table cell.
func statusToHtml(status tldr.StatusEnum) template.HTML {
	class := ""
	text := ""
	switch status {
	case tldr.StatusTranslated:
		class = "bg-green-200"
		text = "✔"
		break
	case tldr.StatusOutdated:
		class = "bg-orange-200"
		text = "⚠"
		break
	case tldr.StatusNoTranslation:
		class = "bg-red-200"
		text = "✖"
		break
	default:
		text = "?"
		break
	}

	return template.HTML("<td class='" + class + "'>" + text + "</td>")
}

// Returns a string consisting of the percentage without the decimals and a percentage sign
func printPercentage(p float64) string {
	return fmt.Sprintf("%.0f%%", p*100)
}
