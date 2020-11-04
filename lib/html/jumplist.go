package html

// language=gohtml
const htmlJumpList = `
{{- define "jumpList" -}}
<div class="my-10">
	<h3 class="text-2xl p-5">Quick Jump List</h3>
	{{- range $index, $os := .Os -}}
		<a href="#{{ $os }}" class="hover:text-blue-500">{{ $os }}</a>{{ if lt $index (minus (len $.Os) 1) }} - {{end}}
	{{- end -}}
</div>
{{- end -}}
`
