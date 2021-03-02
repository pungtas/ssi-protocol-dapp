/*
	Tyron: Self-Sovereign Identity Protocol Dapp
	Copyright (C) 2021 Tyron Pungtas Open Association

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
*/

import * as ReactNative from 'react-native';
import Colors from '../../constants/colors';
import useColorScheme from '../../hooks/useColorScheme';

// Background images
export const tyronNet = require('./tyronNet.jpg');

export function useThemeColor(
	props: { light?: string; dark?: string },
	colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
	const theme = useColorScheme();
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	} else {
		return Colors[theme][colorName];
	}
}

type ThemeProps = {
	lightColor?: string;
	darkColor?: string;
};

export type TextProps = ThemeProps & ReactNative.Text['props'];
export type ViewProps = ThemeProps & ReactNative.View['props'];

export function Text(props: TextProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

	return <ReactNative.Text style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

	return <ReactNative.View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const styles = ReactNative.StyleSheet.create({
	slogan: {
		fontSize: 27,
		fontWeight: '400',
		fontFamily: 'Ubuntu',
		color: '#fff'
	},
	separator: {
		height: 1,
		width: '70.5%',
		marginBottom: 40,
  	},
	title: {
		flex: 1,
		fontSize: 53,
		fontWeight: '700',
		fontFamily: 'Ubuntu',
		marginTop: 70,
		marginBottom: 40,
		color: '#e8e357'
	},
	pungMeText: {
		fontSize: 22,
		color: '#fff',
		marginBottom: 40,
		fontFamily: 'Ubuntu'
	},
	button: {
		marginBottom: 25,
		backgroundColor: 'white',
		padding: 5,
		borderRadius: 5,
		alignItems: 'center',
		flexDirection: 'row-reverse'
	},
	buttonText: {
		marginVertical: 10,
		marginHorizontal: 20,
		fontSize: 29,
		color: '#000',
		fontFamily: 'Ubuntu',
		fontWeight: '400'
	},
	inputText: {
		fontSize: 24,
		color: '#000',
		marginVertical: 40,
		fontFamily: 'Ubuntu'
	},
	image: {
		height: ReactNative.Dimensions.get('screen').height,
		width: ReactNative.Dimensions.get('screen').width,
		flex: 1,
	},
	container: {
		height: ReactNative.Dimensions.get('screen').height,
		width: ReactNative.Dimensions.get('screen').width,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	resolverContainer: {
		flex: 1,
		marginTop: 95,
		marginHorizontal: 40,
		alignItems: 'flex-start'
	},
	resolvedContainer: {
		flex: 1,
		alignItems: 'flex-start',
		marginHorizontal: 40,
		backgroundColor: 'transparent',
	},
	pungMeContainer: {
		flex: 1,
		backgroundColor: 'transparent',
		alignItems: 'center',
	},
	tab: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	DIDdappsTitle: {
		flex: 1,
		fontSize: 25,
		fontWeight: 'bold',
		fontFamily: 'Ubuntu',
		lineHeight: 40,
		marginTop: 20,
		marginBottom: 15,
		marginHorizontal: 40,
		color: '#e6c422'
	},
	DIDdocumentTitle: {
		flex: 1,
		fontSize: 25,
		fontWeight: 'bold',
		fontFamily: 'Ubuntu',
		lineHeight: 40,
		marginTop: 20,
		marginBottom: 15,
		marginHorizontal: 40,
		color: '#fff'
	},
	legend: {
		fontSize: 25,
		fontWeight: '800',
		fontFamily: 'Ubuntu',
		textAlign: 'center',
		marginTop: 25,
		marginBottom: 10,
		color: '#cccccc'
	},
	options: {
		flexDirection: 'row',
		marginVertical: 10,
		backgroundColor: 'transparent'
	},
	options2: {
		marginVertical: 10,
		backgroundColor: 'transparent'
	},
	options3: {
		flex: 1,
		backgroundColor: 'transparent'
	},
	document: {
		marginHorizontal: 150,
	},
	documentLegend: {
		fontSize: 25,
		fontFamily: 'Ubuntu',
		fontWeight: '700',
		marginTop: 25,
		marginBottom: 25,
		color: '#e6c422'
	},
	documentItem: {
		fontSize: 20,
		fontFamily: 'Ubuntu',
		color: '#cccccc',
	},
	documentDescription: {
		marginHorizontal: 60,
		fontSize: 20,
		fontFamily: 'Ubuntu',
		color: '#fff',
	},
	radioCircle: {
		marginHorizontal: 10,
		height: 25,
		width: 25,
		borderRadius: 100,
		borderWidth: 3,
		borderColor: '#e6c422',
		alignItems: 'center',
		justifyContent: 'center',
		},
	radioText: {
		marginHorizontal: 2,
		fontSize: 20,
		fontFamily: 'Ubuntu',
		color: '#fff',
		fontWeight: '500',
	},
	selectedRb: {
		width: 15,
		height: 15,
		borderRadius: 50,
		backgroundColor: '#cccccc',
	},
	circleGradient: {
		margin: 1,
		backgroundColor: "white",
		borderRadius: 5
	},
	visit: {
		margin: 4,
		paddingHorizontal: 6,
		textAlign: "center",
		backgroundColor: "white",
		color: '#008f68',
		fontSize: 12
	}
});
