export function replaceSpace(html) {
	return html
		.replace(/(\&nbsp\;){2,}/g, s => s.length / 6 > 35 ? '' : `<span style="margin-left:${s.length  / 18 }em;" />`)
		// .replace('http','https')
		.replace(`style="font-size:38px; font-weight:bold; line-height:40px;"`,
			`style="display: block;padding: 0 20rpx;font-size: 20px;font-weight: bold;"`);
}
