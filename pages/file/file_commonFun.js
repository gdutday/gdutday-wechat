export function iconType(type) {
	type = type.toLowerCase();
	if (type == 'folder') type = 'folder';
	else if (type == 'docx' || type == 'doc') type = 'doc';
	else if (type == 'xls' || type == 'xlsx') type = 'xls';
	else if (type == 'ppt' || type == 'pptx') type = 'ppt';
	else if (type == 'rar' || type == 'zip' || type == '7z') type = 'zip';
	else if (type == 'jpg' || type == 'jpeg' || type == 'gif' || type == 'png') type = 'pic';
	else if (type == 'pdf') type = 'pdf';
	else type = 'unknown';
	return type;
}
