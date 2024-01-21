'use client';

import { useSignal } from '@preact/signals-react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { ErrorAlert, SuccessAlert } from '../../../components/Alert';
import { Games, Opponents, Teams, Venues, importData } from '../actions';
import { FIxturePages, Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';

dayjs.extend(utc);
dayjs.extend(timezone);

export type ImportState =
	| {
			type: 'success' | 'loading';
	  }
	| {
			type: 'error';
			message: string;
	  };

export function ImportPage({ teachers }: { teachers: { id: string; name?: string | null }[] }) {
	const [step, setStep] = useState(1);

	const [disablePrevious, setDisablePrevious] = useState(false);
	// TODO: check back to true
	const [disableNext, setDisableNext] = useState(false);
	const [nextLoading, setNextLoading] = useState(false);

	const fixturePages = useSignal<FIxturePages>([
		{
			type: 'junior',
			gender: 'boys',
			teams: [
				{ name: 'netball', number: '1' },
				{ name: 'netball', number: '2' },
				{ name: 'volleyball', number: '1' },
				{ name: 'volleyball', number: '2' },
			],
			games: [
				[
					{
						date: '2024-02-14',
						games: [
							{ team1: 'chki', team2: 'ligh', venue: 'ddna 1' },
							{ team1: 'mara 2', team2: 'chpa 3', venue: 'ddna 2' },
							{ team1: 'mara 1', team2: 'chpa 2', venue: 'ddna 3' },
							{ team1: 'mtev', team2: 'waws', venue: 'tbu' },
							{ team1: 'nort', team2: 'wanw', venue: 'disc 1' },
						],
					},
					{
						date: '2024-02-28',
						games: [
							{ team1: 'chpa 3', team2: 'chpa 1', venue: 'cdlf 1' },
							{ team1: 'ligh', team2: 'mara 2', venue: 'spri 1' },
							{ team1: 'stan', team2: 'chki', venue: 'krnc 1' },
							{ team1: 'mtev', team2: 'chpa 2', venue: 'tbu' },
							{ team1: 'nort', team2: 'mara 1', venue: 'disc 1' },
							{ team1: 'wanw', team2: 'waws', venue: 'cass 1' },
						],
					},
					{
						date: '2024-03-13',
						games: [
							{ team1: 'chpa 1', team2: 'ligh', venue: 'cdlf 1' },
							{ team1: 'chki', team2: 'mara 2', venue: 'ddna 1' },
							{ team1: 'chpa 2', team2: 'wanw', venue: 'cdlf 2' },
							{ team1: 'nort', team2: 'waws', venue: 'disc 1' },
							{ team1: 'mara 1', team2: 'mtev', venue: 'ddna 2' },
						],
					},
					{
						date: '2024-03-27',
						games: [
							{ team1: 'mara 2', team2: 'chpa 1', venue: 'ddna 1' },
							{ team1: 'chpa 3', team2: 'chki', venue: 'cdlf 1' },
							{ team1: 'ligh', team2: 'stan', venue: 'spri 1' },
							{ team1: 'mara 1', team2: 'wanw', venue: 'ddna 2' },
							{ team1: 'nort', team2: 'mtev', venue: 'disc 1' },
						],
					},
					{
						date: '2024-04-24',
						games: [
							{ team1: 'chpa 1', team2: 'chki', venue: 'cdlf 1' },
							{ team1: 'mara 2', team2: 'stan', venue: 'ddna 2' },
							{ team1: 'chpa 3', team2: 'ligh', venue: 'cdlf 2' },
							{ team1: 'nort', team2: 'chpa 2', venue: 'disc 1' },
							{ team1: 'wanw', team2: 'mtev', venue: 'cass 1' },
							{ team1: 'waws', team2: 'mara 1', venue: 'tbu' },
						],
					},
					{
						date: '2024-05-22',
						games: [
							{ team1: 'chpa 1', team2: 'stan *', venue: 'cdlf 1' },
							{ team1: 'chpa 3', team2: 'stan*', venue: 'cdlf 1' },
							{ team1: 'chpa 2', team2: 'waws', venue: 'cdlf 2' },
						],
					},
					{ date: '2024-06-05', games: [{ text: 'GRAND FINAL' }] },
				],
				null,
				[
					{
						date: '2024-02-14',
						games: [
							{ team1: 'edin', team2: 'mara', venue: 'edin 1' },
							{ team1: 'waws', team2: 'mtev', venue: 'tbu' },
							{ team1: 'chki', team2: 'bye', venue: 'daba 2' },
							{ team1: 'stan', team2: 'heri', venue: 'stan 1' },
							{ team1: 'chpa', team2: 'ligh', venue: 'cdlf 1' },
							{ team1: 'wanw', team2: 'bye', venue: 'wanw 1' },
						],
					},
					{
						date: '2024-02-28',
						games: [
							{ team1: 'waws', team2: 'chki', venue: 'tbu' },
							{ team1: 'mtev', team2: 'edin', venue: 'tbu' },
							{ team1: 'mara', team2: 'bye', venue: 'mara 1' },
							{ team1: 'chpa', team2: 'wanw', venue: 'cdlf 3' },
							{ team1: 'ligh', team2: 'stan', venue: 'spri 2' },
							{ team1: 'heri', team2: 'bye', venue: 'heri 2' },
						],
					},
					{
						date: '2024-03-13',
						games: [
							{ team1: 'edin', team2: 'waws', venue: 'edin 1' },
							{ team1: 'chki', team2: 'mara', venue: 'daba 1' },
							{ team1: 'mtev', team2: 'bye', venue: 'mtev 1' },
							{ team1: 'wanw', team2: 'ligh', venue: 'wanw 1' },
							{ team1: 'heri', team2: 'chpa', venue: 'heri 2' },
							{ team1: 'stan', team2: 'bye', venue: 'stan 2' },
						],
					},
					{
						date: '2024-03-27',
						games: [
							{ team1: 'mtev', team2: 'mara', venue: 'tbu' },
							{ team1: 'edin', team2: 'chki', venue: 'edin 1' },
							{ team1: 'waws', team2: 'bye', venue: 'waws 1' },
							{ team1: 'ligh', team2: 'heri', venue: 'spri 2' },
							{ team1: 'stan', team2: 'wanw', venue: 'stan 1' },
							{ team1: 'chpa', team2: 'bye', venue: 'cdlf 3' },
						],
					},
					{
						date: '2024-04-24',
						games: [
							{ team1: 'chki', team2: 'mtev', venue: 'daba 2' },
							{ team1: 'mara', team2: 'waws', venue: 'daba 3' },
							{ team1: 'edin', team2: 'bye', venue: 'edin 1' },
							{ team1: 'wanw', team2: 'heri', venue: 'wanw 1' },
							{ team1: 'stan', team2: 'chpa', venue: 'stan 1' },
							{ team1: 'ligh', team2: 'bye', venue: 'ligh 1' },
						],
					},
					{
						date: '2024-05-22',
						games: [
							{ text: 'semi finals - 1a v 2b' },
							{ text: 'semi finals – 2a v 1b' },
							{ text: 'semi finals - 3a v 4b' },
							{ text: 'semi finals - 4a v 3b' },
							{ text: 'semi finals - 5a v 5b' },
						],
					},
					{ date: '2024-06-05', games: [{ text: 'GRAND FINAL' }] },
				],
				[
					{
						date: '2024-02-14',
						games: [
							{ team1: 'wanw', team2: 'mtev 2', venue: 'wanw 1' },
							{ team1: 'heri', team2: 'stan', venue: 'heri 2' },
							{ team1: 'mara', team2: 'mtev 1', venue: 'daba 1' },
							{ team1: 'chpa', team2: 'waws', venue: 'cdlf 2' },
						],
					},
					{
						date: '2024-02-28',
						games: [
							{ team1: 'mtev 2', team2: 'chpa', venue: 'tbu' },
							{ team1: 'waws', team2: 'mara', venue: 'tbu' },
							{ team1: 'mtev 1', team2: 'heri', venue: 'tbu' },
							{ team1: 'stan', team2: 'wanw', venue: 'stan 1' },
						],
					},
					{
						date: '2024-03-13',
						games: [
							{ team1: 'stan', team2: 'mtev 2', venue: 'stan 1' },
							{ team1: 'wanw', team2: 'mtev 1', venue: 'wanw 2' },
							{ team1: 'heri', team2: 'waws', venue: 'heri 3' },
							{ team1: 'mara', team2: 'chpa', venue: 'daba 2' },
						],
					},
					{
						date: '2024-03-27',
						games: [
							{ team1: 'mtev 2', team2: 'mara', venue: 'tbu' },
							{ team1: 'chpa', team2: 'heri', venue: 'cdlf 3' },
							{ team1: 'waws', team2: 'wanw', venue: 'tbu' },
							{ team1: 'mtev 1', team2: 'stan', venue: 'tbu' },
						],
					},
					{
						date: '2024-04-24',
						games: [
							{ team1: 'mtev 1', team2: 'mtev 2', venue: 'tbu' },
							{ team1: 'stan', team2: 'waws', venue: 'stan 2' },
							{ team1: 'wanw', team2: 'chpa', venue: 'wanw 2' },
							{ team1: 'heri', team2: 'mara', venue: 'heri 2' },
						],
					},
					{
						date: '2024-05-22',
						games: [
							{ team1: 'mtev 2', team2: 'heri', venue: 'tbu' },
							{ team1: 'mara', team2: 'wanw', venue: 'daba 2' },
							{ team1: 'chpa', team2: 'stan', venue: 'cdlf 4' },
							{ team1: 'waws', team2: 'mtev 1', venue: 'tbu' },
						],
					},
					{
						date: '2024-06-05',
						games: [
							{ team1: 'waws', team2: 'mtev 2', venue: 'tbu' },
							{ team1: 'mtev 1', team2: 'chpa', venue: 'tbu' },
							{ team1: 'stan', team2: 'mara', venue: 'stan 1' },
							{ team1: 'wanw', team2: 'heri', venue: 'wanw 1' },
						],
					},
				],
			],
		},
		{
			type: 'junior',
			gender: 'girls',
			teams: [
				{ name: 'basketball', number: '1' },
				{ name: 'basketball', number: '2' },
				{ name: 'soccer', number: '1' },
				{ name: 'soccer', number: '2' },
			],
			games: [
				[
					{
						date: '2024-02-14',
						games: [
							{ team1: 'mtev', team2: 'edin', venue: 'tbu' },
							{ team1: 'waws', team2: 'mara', venue: 'tbu' },
							{ team1: 'wanw', team2: 'bye', venue: 'wanw 1' },
							{ team1: 'heri', team2: 'stan', venue: 'heri 1' },
							{ team1: 'ligh', team2: 'chpa', venue: 'spri 1' },
							{ team1: 'chki', team2: 'bye', venue: 'daba 5' },
						],
					},
					{
						date: '2024-02-28',
						games: [
							{ team1: 'waws', team2: 'wanw', venue: 'tbu' },
							{ team1: 'mara', team2: 'mtev', venue: 'daba 2' },
							{ team1: 'edin', team2: 'bye', venue: 'edin 1' },
							{ team1: 'chki', team2: 'chpa', venue: 'daba 1' },
							{ team1: 'stan', team2: 'ligh', venue: 'sbc 1' },
							{ team1: 'heri', team2: 'bye', venue: 'heri 1' },
						],
					},
					{
						date: '2024-03-13',
						games: [
							{ team1: 'mtev', team2: 'waws', venue: 'tbu' },
							{ team1: 'wanw', team2: 'edin', venue: 'cass 1' },
							{ team1: 'mara', team2: 'bye', venue: 'mara 1' },
							{ team1: 'ligh', team2: 'chki', venue: 'spri 1' },
							{ team1: 'chpa', team2: 'heri', venue: 'cdlf 3' },
							{ team1: 'stan', team2: 'bye', venue: 'stan 2' },
						],
					},
					{
						date: '2024-03-27',
						games: [
							{ team1: 'mara', team2: 'edin', venue: 'daba 1' },
							{ team1: 'mtev', team2: 'wanw', venue: 'tbu' },
							{ team1: 'waws', team2: 'bye', venue: 'waws 1' },
							{ team1: 'chpa', team2: 'stan', venue: 'cdlf 2' },
							{ team1: 'heri', team2: 'chki', venue: 'heri 1' },
							{ team1: 'ligh', team2: 'bye', venue: 'ligh 1' },
						],
					},
					{
						date: '2024-04-24',
						games: [
							{ team1: 'wanw', team2: 'mara', venue: 'cass 2' },
							{ team1: 'edin', team2: 'waws', venue: 'ksba 5' },
							{ team1: 'mtev', team2: 'bye', venue: 'tbu' },
							{ team1: 'chki', team2: 'stan', venue: 'daba 1' },
							{ team1: 'heri', team2: 'ligh', venue: 'heri 1' },
							{ team1: 'chpa', team2: 'bye', venue: 'cdlf 3' },
						],
					},
					{
						date: '2024-05-22',
						games: [
							{ text: 'semi finals - 1a v 2b' },
							{ text: 'semi finals – 2a v 1b' },
							{ text: 'semi finals - 3a v 4b' },
							{ text: 'semi finals - 4a v 3b' },
							{ text: 'semi finals - 5a v 5b' },
						],
					},
					{ date: '2024-06-05', games: [{ text: 'GRAND FINAL' }] },
				],
				[
					{
						date: '2024-02-14',
						games: [
							{ team1: 'wanw', team2: 'chpa', venue: 'cass 1' },
							{ team1: 'edin', team2: 'stan', venue: 'ksba 5' },
							{ team1: 'nort', team2: 'mtev 2', venue: 'disc 2' },
							{ team1: 'mara', team2: 'mtev 1', venue: 'daba 3' },
						],
					},
					{
						date: '2024-02-28',
						games: [
							{ team1: 'chpa', team2: 'mara', venue: 'cdlf 2' },
							{ team1: 'nort', team2: 'mtev 1', venue: 'disc 2' },
							{ team1: 'mtev 2', team2: 'edin', venue: 'tbu' },
							{ team1: 'stan', team2: 'wanw', venue: 'sbc 2' },
						],
					},
					{
						date: '2024-03-13',
						games: [
							{ team1: 'stan', team2: 'chpa', venue: 'sbc 1' },
							{ team1: 'wanw', team2: 'mtev 2', venue: 'cass 1' },
							{ team1: 'edin', team2: 'mtev 1', venue: 'ksba 5' },
							{ team1: 'nort', team2: 'mara', venue: 'disc 2' },
						],
					},
					{
						date: '2024-03-27',
						games: [
							{ team1: 'nort', team2: 'chpa', venue: 'disc 2' },
							{ team1: 'mara', team2: 'edin', venue: 'daba 2' },
							{ team1: 'mtev 1', team2: 'wanw', venue: 'tbu' },
							{ team1: 'mtev 2', team2: 'stan', venue: 'tbu' },
						],
					},
					{
						date: '2024-04-24',
						games: [
							{ team1: 'mtev 2', team2: 'chpa', venue: 'tbu' },
							{ team1: 'stan', team2: 'mtev 1', venue: 'sbc 1' },
							{ team1: 'wanw', team2: 'mara', venue: 'cass 3' },
							{ team1: 'nort', team2: 'edin', venue: 'disc 2' },
						],
					},
					{
						date: '2024-05-22',
						games: [
							{ team1: 'chpa', team2: 'edin', venue: 'cdlf 3' },
							{ team1: 'nort', team2: 'wanw', venue: 'disc 2' },
							{ team1: 'mara', team2: 'stan', venue: 'daba 1' },
							{ team1: 'mtev 1', team2: 'mtev 2', venue: 'tbu' },
						],
					},
					{
						date: '2024-06-05',
						games: [
							{ team1: 'mtev 1', team2: 'chpa', venue: 'tbu' },
							{ team1: 'mtev 2', team2: 'mara', venue: 'tbu' },
							{ team1: 'nort', team2: 'stan', venue: 'disc 2' },
							{ team1: 'wanw', team2: 'edin', venue: 'cass 1' },
						],
					},
				],
				[
					{
						date: '2024-02-14',
						games: [
							{ team1: 'heri', team2: 'stan', venue: 'heri 4' },
							{ team1: 'waws 2', team2: 'ligh', venue: 'tbu' },
							{ team1: 'chpa 1', team2: 'bye', venue: 'iyu 2' },
							{ team1: 'chpa 2', team2: 'waws 1', venue: 'iyu 1' },
							{ team1: 'wanw', team2: 'chki', venue: 'wanw 3' },
							{ team1: 'mara', team2: 'bye', venue: 'mara 1' },
						],
					},
					{
						date: '2024-02-28',
						games: [
							{ team1: 'chpa 1', team2: 'ligh', venue: 'iyu 1' },
							{ team1: 'stan', team2: 'waws 2', venue: 'elee 1' },
							{ team1: 'heri', team2: 'bye', venue: 'heri 4' },
							{ team1: 'chpa 2', team2: 'mara', venue: 'iyu 2' },
							{ text: 'CHKI v WAWS 1' },
							{ team1: 'wanw', team2: 'bye', venue: 'wanw 1' },
						],
					},
					{
						date: '2024-03-13',
						games: [
							{ team1: 'waws 2', team2: 'chpa 1', venue: 'tbu' },
							{ team1: 'ligh', team2: 'heri', venue: 'tatt 1' },
							{ team1: 'stan', team2: 'bye', venue: 'stan 1' },
							{ team1: 'mara', team2: 'waws 1', venue: 'chal 1' },
							{ team1: 'chpa 2', team2: 'wanw', venue: 'iyu 1' },
							{ team1: 'chki', team2: 'bye', venue: 'chki 2' },
						],
					},
					{
						date: '2024-03-27',
						games: [
							{ team1: 'heri', team2: 'chpa 1', venue: 'heri 4' },
							{ team1: 'ligh', team2: 'stan', venue: 'tatt 1' },
							{ team1: 'waws 2', team2: 'bye', venue: 'waws 1' },
							{ team1: 'wanw', team2: 'mara', venue: 'wanw 3' },
							{ team1: 'chki', team2: 'chpa 2', venue: 'chki 2' },
							{ team1: 'waws', team2: 'bye', venue: 'waws 2' },
						],
					},
					{
						date: '2024-04-24',
						games: [
							{ team1: 'chpa 1', team2: 'stan', venue: 'iyu 1' },
							{ team1: 'heri', team2: 'waws 2', venue: 'heri 4' },
							{ team1: 'ligh', team2: 'bye', venue: 'ligh 1' },
							{ team1: 'mara', team2: 'chki', venue: 'chal 1' },
							{ team1: 'waws 1', team2: 'wanw', venue: 'tbu' },
							{ team1: 'chpa 2', team2: 'bye', venue: 'iyu 2' },
						],
					},
					{
						date: '2024-05-22',
						games: [
							{ text: 'semi finals - 1a v 2b' },
							{ text: 'semi finals – 2a v 1b' },
							{ text: 'semi finals - 3a v 4b' },
							{ text: 'semi finals - 4a v 3b' },
							{ text: 'semi finals - 5a v 5b' },
						],
					},
					{ date: '2024-06-05', games: [{ text: 'GRAND FINAL' }] },
				],
			],
		},
		{
			type: 'intermediate',
			gender: 'boys',
			teams: [
				{ name: 'netball', number: '1' },
				{ name: 'netball', number: '2' },
				{ name: 'volleyball', number: '1' },
				{ name: 'volleyball', number: '2' },
			],
			games: [
				[
					{
						date: '2024-02-07',
						games: [
							{ team1: 'nort', team2: 'stan', venue: 'disc 1' },
							{ team1: 'chpa 2', team2: 'bye', venue: 'chpa 0' },
							{ team1: 'mara 2', team2: 'ligh', venue: 'daba 1' },
							{ team1: 'chpa 1', team2: 'chki', venue: 'cdlf 1' },
						],
					},
					{
						date: '2024-02-21',
						games: [
							{ team1: 'waws 1', team2: 'chpa 2', venue: 'tbu' },
							{ team1: 'nort', team2: 'mara 1', venue: 'disc 1' },
							{ team1: 'stan', team2: 'bye', venue: 'stan 0' },
							{ team1: 'waws 2', team2: 'chpa 1', venue: 'tbu' },
							{ team1: 'wanw', team2: 'mara 2', venue: 'cass 1' },
							{ team1: 'ligh', team2: 'chki', venue: 'spri 1' },
						],
					},
					{
						date: '2024-03-06',
						games: [
							{ team1: 'chpa 2', team2: 'stan', venue: 'cdlf 1' },
							{ team1: 'nort', team2: 'waws 1', venue: 'disc 1' },
							{ team1: 'mara 1', team2: 'bye', venue: 'mara 0' },
							{ team1: 'chpa 1', team2: 'ligh', venue: 'cdlf 2' },
							{ team1: 'mara 2', team2: 'waws 2', venue: 'daba 1' },
							{ team1: 'chki', team2: 'wanw', venue: 'ddna 1' },
						],
					},
					{
						date: '2024-03-20',
						games: [
							{ team1: 'nort', team2: 'chpa 2', venue: 'disc 1' },
							{ team1: 'mara 1', team2: 'stan', venue: 'daba 1' },
							{ team1: 'waws 1', team2: 'bye', venue: 'waws 0' },
							{ team1: 'mara 2', team2: 'chpa 1', venue: 'daba 2' },
							{ team1: 'wanw', team2: 'ligh', venue: 'cass 1' },
						],
					},
					{
						date: '2024-05-01',
						games: [
							{ team1: 'chpa 2', team2: 'mara 1', venue: 'cdlf 1' },
							{ team1: 'stan', team2: 'waws 1', venue: 'krnc 1' },
							{ team1: 'nort', team2: 'bye', venue: 'no rt 0' },
							{ team1: 'chpa 1', team2: 'wanw', venue: 'cdlf 2' },
							{ team1: 'ligh', team2: 'waws 2', venue: 'spri 1' },
							{ team1: 'chki', team2: 'mara 2', venue: 'd dna 1' },
						],
					},
					{
						date: '2024-05-15',
						games: [
							{ team1: 'waws 1', team2: 'mara 1', venue: 'tbu' },
							{ team1: 'waws 2*', team2: 'wanw', venue: 'tbu' },
							{ team1: 'waws 2*', team2: 'chki', venue: 'tbu' },
						],
					},
					{ date: '2024-05-29', games: [{ text: 'GRAND FINAL' }] },
				],
				null,
				[
					{
						date: '2024-02-07',
						games: [
							{ team1: 'mtev', team2: 'mara', venue: 'tbu' },
							{ team1: 'stan', team2: 'bye', venue: 'stan 0' },
							{ team1: 'heri', team2: 'chki', venue: 'heri 2' },
							{ team1: 'edin', team2: 'ligh', venue: 'edin 1' },
							{ team1: 'chpa', team2: 'bye', venue: 'chpa 0' },
						],
					},
					{
						date: '2024-02-21',
						games: [
							{ team1: 'stan', team2: 'mtev', venue: 'stan 1' },
							{ team1: 'mara', team2: 'waws', venue: 'daba 1' },
							{ team1: 'wanw', team2: 'bye', venue: 'wanw 0' },
							{ team1: 'ligh', team2: 'chpa', venue: 'spri 2' },
							{ team1: 'chki', team2: 'bye', venue: 'chki 0' },
						],
					},
					{
						date: '2024-03-06',
						games: [
							{ team1: 'mara', team2: 'wanw', venue: 'daba 2' },
							{ team1: 'waws', team2: 'stan', venue: 'tbu' },
							{ team1: 'mtev', team2: 'bye', venue: 'mtev 0' },
							{ team1: 'chki', team2: 'ligh', venue: 'daba 6' },
							{ team1: 'chpa', team2: 'edin', venue: 'cdlf 3' },
							{ team1: 'heri', team2: 'bye', venue: 'heri 0' },
						],
					},
					{
						date: '2024-03-20',
						games: [
							{ team1: 'stan', team2: 'wanw', venue: 'stan 1' },
							{ team1: 'mara', team2: 'bye', venue: 'mara 0' },
							{ team1: 'chpa', team2: 'heri', venue: 'cdlf 1' },
							{ team1: 'edin', team2: 'chki', venue: 'edin 1' },
							{ team1: 'ligh', team2: 'bye', venue: 'ligh 0' },
						],
					},
					{
						date: '2024-05-01',
						games: [
							{ team1: 'wanw', team2: 'mtev', venue: 'wanw 1' },
							{ team1: 'stan', team2: 'mara', venue: 'stan 1' },
							{ team1: 'waws', team2: 'bye', venue: 'waws 0' },
							{ team1: 'heri', team2: 'ligh', venue: 'heri 2' },
							{ team1: 'chki', team2: 'chpa', venue: 'daba 6' },
							{ team1: 'edin', team2: 'bye', venue: 'edin 0' },
						],
					},
					{
						date: '2024-05-15',
						games: [
							{ team1: 'waws*', team2: 'wanw', venue: 'tbu' },
							{ team1: 'waws*', team2: 'mtev', venue: 'tbu' },
							{ team1: 'edin', team2: 'heri', venue: 'edin 1' },
						],
					},
					{ date: '2024-05-29', games: [{ text: 'GRAND FINAL' }] },
				],
				[
					{
						date: '2024-02-07',
						games: [
							{ team1: 'mtev 1', team2: 'heri', venue: 'tbu' },
							{ team1: 'mara', team2: 'chpa', venue: 'daba 5' },
							{ team1: 'stan', team2: 'mtev 2', venue: 'stan 1' },
							{ team1: 'wanw', team2: 'waws', venue: 'wanw 1' },
						],
					},
					{
						date: '2024-02-21',
						games: [
							{ team1: 'mara', team2: 'mtev 1', venue: 'daba 5' },
							{ team1: 'stan', team2: 'heri', venue: 'stan 2' },
							{ team1: 'wanw', team2: 'chpa', venue: 'wanw 1' },
							{ team1: 'waws', team2: 'mtev 2', venue: 'tbu' },
						],
					},
					{
						date: '2024-03-06',
						games: [
							{ team1: 'mtev 1', team2: 'chpa', venue: 'tbu' },
							{ team1: 'heri', team2: 'mtev 2', venue: 'heri 2' },
							{ team1: 'mara', team2: 'waws', venue: 'daba 5' },
							{ team1: 'stan', team2: 'wanw', venue: 'stan 1' },
						],
					},
					{
						date: '2024-03-20',
						games: [
							{ team1: 'mtev 1', team2: 'mtev 2', venue: 'tbu' },
							{ team1: 'chpa', team2: 'waws', venue: 'cdlf 2' },
							{ team1: 'heri', team2: 'wanw', venue: 'heri 2' },
							{ team1: 'mara', team2: 'stan', venue: 'daba 5' },
						],
					},
					{
						date: '2024-05-01',
						games: [
							{ team1: 'wanw', team2: 'mtev 1', venue: 'wanw 2' },
							{ team1: 'waws', team2: 'stan', venue: 'tbu' },
							{ team1: 'mtev 2', team2: 'mara', venue: 'tbu' },
							{ team1: 'chpa', team2: 'heri', venue: 'cdlf 3' },
						],
					},
					{
						date: '2024-05-15',
						games: [
							{ team1: 'waws', team2: 'mtev 1', venue: 'tbu' },
							{ team1: 'mtev 2', team2: 'wanw', venue: 'tbu' },
							{ team1: 'chpa', team2: 'stan', venue: 'cdlf 1' },
							{ team1: 'heri', team2: 'mara', venue: 'heri 2' },
						],
					},
					{
						date: '2024-05-29',
						games: [
							{ team1: 'stan', team2: 'mtev 1', venue: 'stan 1' },
							{ team1: 'wanw', team2: 'mara', venue: 'wanw 1' },
							{ team1: 'waws', team2: 'heri', venue: 'tbu' },
							{ team1: 'mtev 2', team2: 'chpa', venue: 'tbu' },
						],
					},
				],
			],
		},
		{
			type: 'intermediate',
			gender: 'girls',
			teams: [
				{ name: 'basketball', number: '1a' },
				{ name: 'basketball', number: '1b' },
				{ name: 'soccer', number: '1' },
				{ name: 'soccer', number: '2' },
			],
			games: [
				[
					{
						date: '2024-02-07',
						games: [
							{ team1: 'chki', team2: 'chpa 1', venue: 'daba 7' },
							{ team1: 'edin 2', team2: 'mara 2', venue: 'ksba 5' },
							{ team1: 'heri', team2: 'ligh', venue: 'tbu' },
							{ team1: 'wanw 1', team2: 'bye', venue: 'wanw 0' },
						],
					},
					{
						date: '2024-02-21',
						games: [
							{ team1: 'wanw 1', team2: 'chpa 1', venue: 'cass 2' },
							{ team1: 'chki', team2: 'mara 2', venue: 'daba 7' },
							{ team1: 'ligh', team2: 'bye', venue: 'ligh 0' },
						],
					},
					{
						date: '2024-03-06',
						games: [
							{ team1: 'edin 2', team2: 'chki', venue: 'ksba 5' },
							{ team1: 'heri', team2: 'wanw 1', venue: 'tbu' },
							{ team1: 'ligh', team2: 'mara 2', venue: 'spri 3' },
							{ team1: 'chpa 1', team2: 'bye', venue: 'chpa 0' },
						],
					},
					{
						date: '2024-03-20',
						games: [
							{ team1: 'chpa 1', team2: 'heri', venue: 'cdlf 3' },
							{ team1: 'ligh', team2: 'edin 2', venue: 'spri 3' },
							{ team1: 'mara 2', team2: 'bye', venue: 'mara 0' },
						],
					},
					{
						date: '2024-05-01',
						games: [
							{ team1: 'mara 2', team2: 'chpa 1', venue: 'daba 2' },
							{ team1: 'wanw 1', team2: 'ligh', venue: 'cass 1' },
							{ team1: 'chki', team2: 'heri', venue: 'daba 7' },
							{ team1: 'edin 2', team2: 'bye', venue: 'edin 0' },
						],
					},
					{
						date: '2024-05-15',
						games: [
							{ team1: 'edin 2', team2: 'heri', venue: 'ksba 5' },
							{ team1: 'wanw 1', team2: 'chki', venue: 'cass 1' },
						],
					},
					{ date: '2024-05-29', games: [{ text: 'GRAND FINAL' }] },
				],
				[
					{
						date: '2024-02-07',
						games: [
							{ team1: 'nort', team2: 'mara 1', venue: 'disc 2' },
							{ team1: 'mtev', team2: 'edin 1', venue: 'tbu' },
							{ team1: 'stan', team2: 'chpa 2', venue: 'sbc 1' },
						],
					},
					{
						date: '2024-02-21',
						games: [
							{ team1: 'nort', team2: 'waws', venue: 'disc 2' },
							{ team1: 'chpa 2', team2: 'wanw 2', venue: 'cdlf 1' },
							{ team1: 'mara 1', team2: 'mtev', venue: 'daba 2' },
						],
					},
					{
						date: '2024-03-06',
						games: [
							{ team1: 'nort', team2: 'mtev', venue: 'disc 2' },
							{ team1: 'stan', team2: 'mara 1', venue: 'sbc 1' },
							{ team1: 'wanw 2', team2: 'edin 1', venue: 'cass 2' },
							{ team1: 'waws', team2: 'chpa 2', venue: 'tbu' },
						],
					},
					{
						date: '2024-03-20',
						games: [
							{ team1: 'nort', team2: 'edin 1', venue: 'disc 2' },
							{ team1: 'mara 1', team2: 'chpa 2', venue: 'daba 3' },
							{ team1: 'stan', team2: 'wanw 2', venue: 'sbc 1' },
						],
					},
					{
						date: '2024-05-01',
						games: [
							{ team1: 'nort', team2: 'wanw 2', venue: 'disc 2' },
							{ team1: 'waws', team2: 'stan', venue: 'tbu' },
							{ team1: 'chpa 2', team2: 'mtev', venue: 'cdlf 4' },
						],
					},
					{
						date: '2024-05-15',
						games: [
							{ team1: 'waws*', team2: 'wanw 2', venue: 'tbu' },
							{ team1: 'waws*', team2: 'mtev', venue: 'tbu' },
							{ team1: 'edin 1*', team2: 'stan', venue: 'ksba 5' },
							{ team1: 'edin 1*', team2: 'mara 1', venue: 'ksba 5' },
						],
					},
					{ date: '2024-05-29', games: [{ text: 'GRAND FINAL' }] },
				],
				[
					{
						date: '2024-02-07',
						games: [
							{ team1: 'stan', team2: 'mtev', venue: 'elee 1' },
							{ team1: 'chpa', team2: 'wanw', venue: 'iyu 1' },
							{ team1: 'waws', team2: 'mara', venue: 'tbu' },
							{ team1: 'heri', team2: 'ligh', venue: 'heri 4' },
						],
					},
					{
						date: '2024-02-21',
						games: [
							{ team1: 'mara', team2: 'mtev', venue: 'chal 1' },
							{ team1: 'wanw', team2: 'ligh', venue: 'wanw 3' },
							{ team1: 'stan', team2: 'heri', venue: 'elee 1' },
							{ team1: 'chpa', team2: 'waws', venue: 'iyu 1' },
						],
					},
					{
						date: '2024-03-06',
						games: [
							{ team1: 'wanw', team2: 'mtev', venue: 'wanw 3' },
							{ team1: 'stan', team2: 'mara', venue: 'elee 1' },
							{ team1: 'chpa', team2: 'ligh', venue: 'iyu 1' },
							{ team1: 'waws', team2: 'heri', venue: 'tbu' },
						],
					},
					{
						date: '2024-03-20',
						games: [
							{ team1: 'mtev', team2: 'waws', venue: 'tbu' },
							{ team1: 'heri', team2: 'chpa', venue: 'heri 4' },
							{ team1: 'ligh', team2: 'stan', venue: 'tatt 1' },
							{ team1: 'mara', team2: 'wanw', venue: 'chal 1' },
						],
					},
					{
						date: '2024-05-01',
						games: [
							{ team1: 'mtev', team2: 'heri', venue: 'tbu' },
							{ team1: 'ligh', team2: 'waws', venue: 'tatt 1' },
							{ team1: 'mara', team2: 'chpa', venue: 'chal 1' },
							{ team1: 'wanw', team2: 'stan', venue: 'wanw 3' },
						],
					},
					{
						date: '2024-05-15',
						games: [
							{ team1: 'mtev', team2: 'chpa', venue: 'tbu' },
							{ team1: 'waws', team2: 'stan', venue: 'tbu' },
							{ team1: 'heri', team2: 'wanw', venue: 'heri 4' },
							{ team1: 'ligh', team2: 'mara', venue: 'tatt 1' },
						],
					},
					{
						date: '2024-05-29',
						games: [
							{ team1: 'ligh', team2: 'mtev', venue: 'tatt 1' },
							{ team1: 'mara', team2: 'heri', venue: 'chal 1' },
							{ team1: 'wanw', team2: 'waws', venue: 'wanw 3' },
							{ team1: 'stan', team2: 'chpa', venue: 'elee 1' },
						],
					},
				],
			],
		},
	]);
	const venues = useSignal<Venues>([
		{ venue: 'action indoor sports', address: '160 new street ringwood', cfNum: '1', csenCode: 'aisr 1' },
		{ venue: 'action indoor sports', address: '160 new street ringwood', cfNum: '2', csenCode: 'aisr 2' },
		{ venue: 'barry simon reserve', address: 'gleneagles drive, endeavour hills', cfNum: '1', csenCode: 'bsim 1' },
		{ venue: 'belgrave heights', address: '20 wattle valley road belgrave heights', cfNum: '1', csenCode: 'belg 1' },
		{ venue: 'casey fields', address: '369 casey fields boulevard cranbourne east', cfNum: '1', csenCode: 'casf 1' },
		{ venue: 'casey stadium', address: '65 berwick cranbourne road cranbourne east', cfNum: '1', csenCode: 'cass 1' },
		{ venue: 'casey stadium', address: '65 berwick cranbourne road cranbourne east', cfNum: '10', csenCode: 'cass 10' },
		{ venue: 'casey stadium', address: '65 berwick cranbourne road cranbourne east', cfNum: '2', csenCode: 'cass 2' },
		{ venue: 'casey stadium', address: '65 berwick cranbourne road cranbourne east', cfNum: '3', csenCode: 'cass 3' },
		{ venue: 'casey stadium', address: '65 berwick cranbourne road cranbourne east', cfNum: '4', csenCode: 'cass 4' },
		{ venue: 'casey stadium', address: '65 berwick cranbourne road cranbourne east', cfNum: '5', csenCode: 'cass 5' },
		{ venue: 'casey stadium', address: '65 berwick cranbourne road cranbourne east', cfNum: '6', csenCode: 'cass 6' },
		{ venue: 'casey stadium', address: '65 berwick cranbourne road cranbourne east', cfNum: '7', csenCode: 'cass 7' },
		{ venue: 'casey stadium', address: '65 berwick cranbourne road cranbourne east', cfNum: '8', csenCode: 'cass 8' },
		{ venue: 'casey stadium', address: '65 berwick cranbourne road cranbourne east', cfNum: '9', csenCode: 'cass 9' },
		{ venue: 'cardinia life', address: 'olympic way pakenham', cfNum: '1', csenCode: 'cdlf 1' },
		{ venue: 'cardinia life', address: 'olympic way pakenham', cfNum: '2', csenCode: 'cdlf 2' },
		{ venue: 'cardinia life', address: 'olympic way pakenham', cfNum: '3', csenCode: 'cdlf 3' },
		{ venue: 'cardinia life', address: 'olympic way pakenham', cfNum: '4', csenCode: 'cdlf 4' },
		{ venue: 'cardinia life', address: 'olympic way pakenham', cfNum: '5', csenCode: 'cdlf 5' },
		{ venue: 'cardinia life', address: 'olympic way pakenham', cfNum: '6', csenCode: 'cdlf 6' },
		{ venue: 'cardinia life', address: 'olympic way pakenham', cfNum: '7', csenCode: 'cdlf 7' },
		{ venue: 'cardinia life', address: 'olympic way pakenham', cfNum: '8', csenCode: 'cdlf 8' },
		{ venue: 'chairo – pakenham', address: '585 bald hill road pakenham', cfNum: '1', csenCode: 'chpa 1' },
		{ venue: 'chairo – pakenham', address: '585 bald hill road pakenham', cfNum: '2', csenCode: 'chpa 2' },
		{ venue: 'chairo – pakenham', address: '585 bald hill road pakenham', cfNum: '3 - field', csenCode: 'chpa 3' },
		{ venue: 'chairo – pakenham', address: '585 bald hill road pakenham', cfNum: '4 - field', csenCode: 'chpa 4' },
		{
			venue: 'chalcot lodge reserve',
			address: '24 haverstock hill close, endeavour hills',
			cfNum: '1',
			csenCode: 'chal 1',
		},
		{ venue: 'christway – kingston', address: '316 kingston road clarinda', cfNum: '1', csenCode: 'chki 1' },
		{ venue: 'christway – kingston', address: '316 kingston road clarinda', cfNum: '2 – field', csenCode: 'chki 2' },
		{ venue: 'dandenong basketball assoc', address: 'stud road dandenong', cfNum: '1', csenCode: 'daba 1' },
		{ venue: 'dandenong basketball assoc', address: 'stud road dandenong', cfNum: '10', csenCode: 'daba 10' },
		{ venue: 'dandenong basketball assoc', address: 'stud road dandenong', cfNum: '2', csenCode: 'daba 2' },
		{ venue: 'dandenong basketball assoc', address: 'stud road dandenong', cfNum: '3', csenCode: 'daba 3' },
		{ venue: 'dandenong basketball assoc', address: 'stud road dandenong', cfNum: '4', csenCode: 'daba 4' },
		{ venue: 'dandenong basketball assoc', address: 'stud road dandenong', cfNum: '5', csenCode: 'daba 5' },
		{ venue: 'dandenong basketball assoc', address: 'stud road dandenong', cfNum: '6', csenCode: 'daba 6' },
		{ venue: 'dandenong basketball assoc', address: 'stud road dandenong', cfNum: '7', csenCode: 'daba 7' },
		{ venue: 'dandenong basketball assoc', address: 'stud road dandenong', cfNum: '8', csenCode: 'daba 8' },
		{ venue: 'dandenong basketball assoc', address: 'stud road dandenong', cfNum: '9', csenCode: 'daba 9' },
		{ venue: 'dandenong netball assoc.', address: 'bennett street dandenong', cfNum: '1', csenCode: 'ddna 1' },
		{ venue: 'dandenong netball assoc.', address: 'bennett street dandenong', cfNum: '2', csenCode: 'ddna 2' },
		{ venue: 'dandenong netball assoc.', address: 'bennett street dandenong', cfNum: '3', csenCode: 'ddna 3' },
		{ venue: 'dandenong netball assoc.', address: 'bennett street dandenong', cfNum: '4', csenCode: 'ddna 4' },
		{ venue: 'manningham disc', address: '360 springvale road donvale', cfNum: '1', csenCode: 'disc 1' },
		{ venue: 'manningham disc', address: '360 springvale road donvale', cfNum: '2', csenCode: 'disc 2' },
		{ venue: 'edinburgh', address: '33 edinburgh road lilydale', cfNum: '1', csenCode: 'edin 1' },
		{ venue: 'edinburgh', address: '33 edinburgh road lilydale', cfNum: '2 – field', csenCode: 'edin 2' },
		{
			venue: 'endeavour hills leisure centre',
			address: '10 raymond mcmahon blvd endeavour hills',
			cfNum: '1',
			csenCode: 'ehlc 1',
		},
		{ venue: 'egan lee reserve', address: '63 wallace rd, knoxfield', cfNum: '1 - field', csenCode: 'elee 1' },
		{ venue: 'egan lee reserve', address: '63 wallace rd, knoxfield', cfNum: '2 - field', csenCode: 'elee 2' },
		{ venue: 'esther park reserve', address: '25 esther crescent mooroolbark', cfNum: '1 – field', csenCode: 'estp 1' },
		{ venue: 'greaves reserve', address: 'bennett street dandenong', cfNum: '1 – field', csenCode: 'grev 1' },
		{ venue: 'grices road rec reserve', address: '21 grices road berwick', cfNum: '1 - field', csenCode: 'gric 1' },
		{ venue: 'grices road rec reserve', address: '21 grices road berwick', cfNum: '2 – field', csenCode: 'gric 2' },
		{ venue: 'grices road rec reserve', address: '21 grices road berwick', cfNum: '3 – field', csenCode: 'gric 3' },
		{ venue: 'guy turner reserve', address: 'amber street bayswater', cfNum: '1 - field', csenCode: 'gtur 1' },
		{ venue: 'heritage', address: '66 starling road officer', cfNum: '1', csenCode: 'heri 1' },
		{ venue: 'heritage', address: '66 starling road officer', cfNum: '2 – field', csenCode: 'heri 2' },
		{ venue: 'hv jones reserve', address: 'kingston street ferntree gully', cfNum: '1 – field', csenCode: 'hvj 1' },
		{ venue: 'iyu recreation reserve', address: '165 henry road pakenham', cfNum: '1 – field', csenCode: 'iyu 1' },
		{ venue: 'iyu recreation reserve', address: '165 henry road pakenham', cfNum: '2 – field', csenCode: 'iyu 2' },
		{
			venue: 'kingston heath reserve',
			address: 'center dandenong road cheltenham',
			cfNum: '1 - field',
			csenCode: 'kght 1',
		},
		{
			venue: 'kingston heath reserve',
			address: 'center dandenong road cheltenham',
			cfNum: '2 – field',
			csenCode: 'kght 2',
		},
		{ venue: 'keith hume fraser reserve', address: '95 swansea road montrose', cfNum: '1 – field', csenCode: 'khfr 1' },
		{ venue: 'keith hume fraser reserve', address: '95 swansea road montrose', cfNum: '2 – field', csenCode: 'khfr 2' },
		{ venue: 'knox park', address: '1672 ferntree gully road knoxfield', cfNum: '1 – field', csenCode: 'knxp 1' },
		{ venue: 'knox park', address: '1672 ferntree gully road knoxfield', cfNum: '2 – field', csenCode: 'knxp 2' },
		{ venue: 'knox park', address: '1672 ferntree gully road knoxfield', cfNum: '3 - field', csenCode: 'knxp 3' },
		{
			venue: 'knox regional football facility',
			address: 'george street wantirna south',
			cfNum: '1 – field',
			csenCode: 'krff 1',
		},
		{
			venue: 'knox regional netball centre',
			address: '9 dempster street ferntree gully',
			cfNum: '1',
			csenCode: 'krnc 1',
		},
		{
			venue: 'knox regional netball centre',
			address: '9 dempster street ferntree gully',
			cfNum: '2',
			csenCode: 'krnc 2',
		},
		{ venue: 'kilsyth basketball association', address: '115 liverpool road kilsyth', cfNum: '1', csenCode: 'ksba 1' },
		{ venue: 'kilsyth basketball association', address: '115 liverpool road kilsyth', cfNum: '2', csenCode: 'ksba 2' },
		{ venue: 'kilsyth basketball association', address: '115 liverpool road kilsyth', cfNum: '3', csenCode: 'ksba 3' },
		{ venue: 'kilsyth basketball association', address: '115 liverpool road kilsyth', cfNum: '4', csenCode: 'ksba 4' },
		{ venue: 'kilsyth basketball association', address: '115 liverpool road kilsyth', cfNum: '5', csenCode: 'ksba 5' },
		{ venue: 'kilsyth basketball association', address: '115 liverpool road kilsyth', cfNum: '6', csenCode: 'ksba 6' },
		{ venue: 'knox basketball association', address: 'park crescent boronia', cfNum: '1', csenCode: 'kxba 1' },
		{ venue: 'knox basketball association', address: 'park crescent boronia', cfNum: '2', csenCode: 'kxba 2' },
		{ venue: 'knox basketball association', address: 'park crescent boronia', cfNum: '3', csenCode: 'kxba 3' },
		{ venue: 'knox basketball association', address: 'park crescent boronia', cfNum: '4', csenCode: 'kxba 4' },
		{ venue: 'knox basketball association', address: 'park crescent boronia', cfNum: '5', csenCode: 'kxba 5' },
		{ venue: 'knox basketball association', address: 'park crescent boronia', cfNum: '6', csenCode: 'kxba 6' },
		{ venue: 'lewis park', address: 'lewis road wantirna south', cfNum: '1 - field', csenCode: 'lewp 1' },
		{ venue: 'lewis park', address: 'lewis road wantirna south', cfNum: '2 – field', csenCode: 'lewp 2' },
		{ venue: 'lewis park', address: 'lewis road wantirna south', cfNum: '3 – field', csenCode: 'lewp 3' },
		{ venue: 'lighthouse', address: '927 springvale road keysborough', cfNum: '1', csenCode: 'ligh 1' },
		{ venue: 'lighthouse', address: '927 springvale road keysborough', cfNum: '2 – field', csenCode: 'ligh 2' },
		{ venue: 'llewelyn park', address: 'llewelyn park drive wantirna south', cfNum: '1 - field', csenCode: 'llew 1' },
		{ venue: 'llewelyn park', address: 'llewelyn park drive wantirna south', cfNum: '2 - field', csenCode: 'llew 2' },
		{ venue: 'lawson poole reserve', address: '56 marylyn place, cranbourne', cfNum: '1 – field', csenCode: 'lwpl 1' },
		{
			venue: 'lilydale & yarra valley netball',
			address: '125e liverpool road kilsyth',
			cfNum: '1',
			csenCode: 'lyvn 1',
		},
		{
			venue: 'lilydale & yarra valley netball',
			address: '125e liverpool road kilsyth',
			cfNum: '2',
			csenCode: 'lyvn 2',
		},
		{
			venue: 'lilydale & yarra valley netball',
			address: '125e liverpool road kilsyth',
			cfNum: '3',
			csenCode: 'lyvn 3',
		},
		{
			venue: 'lilydale & yarra valley netball',
			address: '125e liverpool road kilsyth',
			cfNum: '4',
			csenCode: 'lyvn 4',
		},
		{ venue: 'maranatha – officer', address: 'rix road officer', cfNum: '1', csenCode: 'maca 1' },
		{ venue: 'maranatha – officer', address: 'maranatha – officer', cfNum: '2 – field', csenCode: 'maca 2' },
		{ venue: 'maranatha – officer', address: 'maranatha – officer', cfNum: '3 – field', csenCode: 'maca 3' },
		{ venue: 'maranatha – end. hills', address: 'reema boulevard endeavour hills', cfNum: '1', csenCode: 'mara 1' },
		{ venue: 'maranatha – end. hills', address: 'reema boulevard endeavour hills', cfNum: '2', csenCode: 'mara 2' },
		{ venue: 'maranatha – end. hills', address: 'maranatha – end. hills', cfNum: '3 – field', csenCode: 'mara 3' },
		{ venue: 'milpera reserve', address: '', cfNum: '1 – field', csenCode: 'milp 1' },
		{ venue: 'mullum mullum stadium', address: '31 springvale road donvale', cfNum: '1', csenCode: 'mmst 1' },
		{ venue: 'mullum mullum stadium', address: '31 springvale road donvale', cfNum: '2', csenCode: 'mmst 2' },
		{
			venue: 'monbulk regional soccer',
			address: '115 old emerald road monbulk',
			cfNum: '1 – field',
			csenCode: 'mrsf 1',
		},
		{
			venue: 'monbulk regional soccer',
			address: '115 old emerald road monbulk',
			cfNum: '2 – field',
			csenCode: 'mrsf 2',
		},
		{ venue: 'mt evelyn', address: '14 hawkins road montrose', cfNum: '1', csenCode: 'mtev 1' },
		{ venue: 'mt evelyn', address: '14 hawkins road montrose', cfNum: '3 – field', csenCode: 'mtev 3' },
		{ venue: 'maroondah nets', address: '154 heathmont road heathmont', cfNum: '1', csenCode: 'nets 1' },
		{ venue: 'maroondah nets', address: '154 heathmont road heathmont', cfNum: '2', csenCode: 'nets 2' },
		{ venue: 'maroondah nets', address: '154 heathmont road heathmont', cfNum: '3', csenCode: 'nets 3' },
		{ venue: 'maroondah nets', address: '154 heathmont road heathmont', cfNum: '4', csenCode: 'nets 4' },
		{ venue: 'maroondah nets', address: '154 heathmont road heathmont', cfNum: '5', csenCode: 'nets 5' },
		{ venue: 'maroondah nets', address: '154 heathmont road heathmont', cfNum: '6', csenCode: 'nets 6' },
		{ venue: 'northside', address: 'mccleans road bundoora', cfNum: '1', csenCode: 'nort 1' },
		{ venue: 'northside', address: 'mccleans road bundoora', cfNum: '2 – field', csenCode: 'nort 2' },
		{ venue: 'oakleigh rec reserve', address: '2a park road oakleigh', cfNum: '1 – field', csenCode: 'oakl 1' },
		{ venue: 'oakleigh rec reserve', address: '2a park road oakleigh', cfNum: '2 – field', csenCode: 'oakl 2' },
		{ venue: 'oakleigh rec reserve', address: '2a park road oakleigh', cfNum: '3 – field', csenCode: 'oakl 3' },
		{
			venue: 'pinks reserve regional netball',
			address: '115 – 123 liverpool road kilsyth',
			cfNum: '1',
			csenCode: 'prnc 1',
		},
		{
			venue: 'pinks reserve regional netball',
			address: '115 – 123 liverpool road kilsyth',
			cfNum: '2',
			csenCode: 'prnc 2',
		},
		{ venue: 'rivercrest', address: '81 ferdinand drive clyde north', cfNum: '1', csenCode: 'rcst 1' },
		{ venue: 'rivercrest', address: '81 ferdinand drive clyde north', cfNum: '2 – field', csenCode: 'rcst 2' },
		{ venue: 'reema reserve', address: 'stacey court endeavour hills', cfNum: '1 – field', csenCode: 'reem 1' },
		{ venue: 'reema reserve', address: 'stacey court endeavour hills', cfNum: '2 – field', csenCode: 'reem 2' },
		{ venue: 'state basketball centre', address: 'george street wantirna south', cfNum: '1', csenCode: 'sbc 1' },
		{ venue: 'state basketball centre', address: 'george street wantirna south', cfNum: '2', csenCode: 'sbc 2' },
		{ venue: 'state basketball centre', address: 'george street wantirna south', cfNum: '3', csenCode: 'sbc 3' },
		{ venue: 'state basketball centre', address: 'george street wantirna south', cfNum: '4', csenCode: 'sbc 4' },
		{ venue: 'state basketball centre', address: 'george street wantirna south', cfNum: '5', csenCode: 'sbc 5' },
		{ venue: 'state basketball centre', address: 'george street wantirna south', cfNum: '6', csenCode: 'sbc 6' },
		{ venue: 'sportlink', address: '2 hanover road vermont south', cfNum: '1', csenCode: 'splk 1' },
		{ venue: 'sportlink', address: '2 hanover road vermont south', cfNum: '2', csenCode: 'splk 2' },
		{ venue: 'sportlink', address: '2 hanover road vermont south', cfNum: '3', csenCode: 'splk 3' },
		{ venue: 'sportlink', address: '2 hanover road vermont south', cfNum: '4', csenCode: 'splk 4' },
		{ venue: 'sportlink', address: '2 hanover road vermont south', cfNum: '5 – out', csenCode: 'splk 5' },
		{ venue: 'sportlink', address: '2 hanover road vermont south', cfNum: '6 – out', csenCode: 'splk 6' },
		{ venue: 'sportlink', address: '2 hanover road vermont south', cfNum: '7 – out', csenCode: 'splk 7' },
		{ venue: 'sportlink', address: '2 hanover road vermont south', cfNum: '8 – out', csenCode: 'splk 8' },
		{ venue: 'springers leisure centre', address: '400 cheltenham road keysborough', cfNum: '1', csenCode: 'spri 1' },
		{ venue: 'springers leisure centre', address: '400 cheltenham road keysborough', cfNum: '2', csenCode: 'spri 2' },
		{ venue: 'springers leisure centre', address: '400 cheltenham road keysborough', cfNum: '3', csenCode: 'spri 3' },
		{ venue: 'springers leisure centre', address: '400 cheltenham road keysborough', cfNum: '4', csenCode: 'spri 4' },
		{ venue: 'st andrews', address: '130 tyner road wantirna south', cfNum: '1', csenCode: 'stan 1' },
		{ venue: 'st andrews', address: '130 tyner road wantirna south', cfNum: '2 - field', csenCode: 'stan 2' },
		{ venue: 'st andrews', address: '130 tyner road wantirna south', cfNum: '3 - court', csenCode: 'stan 3' },
		{ venue: 'state volleyball centre', address: 'stud road dandenong', cfNum: '1', csenCode: 'svc 1' },
		{ venue: 'state volleyball centre', address: 'stud road dandenong', cfNum: '10', csenCode: 'svc 10' },
		{ venue: 'state volleyball centre', address: 'stud road dandenong', cfNum: '2', csenCode: 'svc 2' },
		{ venue: 'state volleyball centre', address: 'stud road dandenong', cfNum: '3', csenCode: 'svc 3' },
		{ venue: 'state volleyball centre', address: 'stud road dandenong', cfNum: '4', csenCode: 'svc 4' },
		{ venue: 'state volleyball centre', address: 'stud road dandenong', cfNum: '5', csenCode: 'svc 5' },
		{ venue: 'state volleyball centre', address: 'stud road dandenong', cfNum: '6', csenCode: 'svc 6' },
		{ venue: 'state volleyball centre', address: 'stud road dandenong', cfNum: '7', csenCode: 'svc 7' },
		{ venue: 'state volleyball centre', address: 'stud road dandenong', cfNum: '8', csenCode: 'svc 8' },
		{ venue: 'state volleyball centre', address: 'stud road dandenong', cfNum: '9', csenCode: 'svc 9' },
		{ venue: 'sweeney reserve', address: 'cnr dempster & melzak way berwick', cfNum: '1 - field', csenCode: 'swee 1' },
		{ venue: 'sweeney reserve', address: 'cnr dempster & melzak way berwick', cfNum: '2 – field', csenCode: 'swee 2' },
		{ venue: 'sweeney reserve', address: 'cnr dempster & melzak way berwick', cfNum: '3 – field', csenCode: 'swee 3' },
		{ venue: 'tatterson park', address: '400 cheltenham road keysborough', cfNum: '1 – field', csenCode: 'tatt 1' },
		{ venue: 'tatterson park', address: '400 cheltenham road keysborough', cfNum: '2 – field', csenCode: 'tatt 2' },
		{ venue: 'waverley – narre warren', address: 'college drive narre warren south', cfNum: '1', csenCode: 'wanw 1' },
		{
			venue: 'waverley – narre warren',
			address: 'college drive narre warren south',
			cfNum: '2 – field',
			csenCode: 'wanw 2',
		},
	]);

	useEffect(() => {
		pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
	}, []);

	const [alert, setAlert] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	function checkNextNeedDisable(newStep: number) {
		if ((newStep === 1 && fixturePages.value.length > 0) || (newStep === 2 && venues.value.length > 0)) return false;
		else return true;
	}

	const [teams, setTeams] = useState<Teams>([]);
	const [opponents, setOpponents] = useState<Opponents>([]);
	const [filteredVenues, setFilteredVenues] = useState<Venues>([]);
	const [games, setGames] = useState<Games>([]);

	const [importState, setImportState] = useState<ImportState>({ type: 'loading' });

	useEffect(() => {
		if (step === 4) {
			importData(teams, opponents, filteredVenues, games, dayjs.tz.guess())
				.then((res) => {
					setImportState(res);
					setNextLoading(false);
				})
				.catch(() => {
					// Shouldn't happen
				});
		}
	}, [step, teams, opponents, filteredVenues, games]);

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				<ul className="steps steps-vertical xs:steps-horizontal">
					<li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Upload Weekly Sport PDF</li>
					<li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Upload Venue PDF</li>
					<li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Check & Edit</li>
					<li className={`step ${step >= 4 ? 'step-primary' : ''}`}>Finish</li>
				</ul>
				<h1 className="text-4xl text-center font-bold">Import Weekly Sport PDF to Database</h1>

				{step === 1 && (
					<Step1
						setAlert={setAlert}
						setNextLoading={setNextLoading}
						setDisableNext={setDisableNext}
						pdfjs={pdfjs}
						fixturePages={fixturePages}
					/>
				)}
				{step === 2 && (
					<Step2
						setAlert={setAlert}
						setNextLoading={setNextLoading}
						setDisableNext={setDisableNext}
						pdfjs={pdfjs}
						venues={venues}
					/>
				)}
				{step === 3 && (
					<Step3
						setAlert={setAlert}
						setDisableNext={setDisableNext}
						fixtures={fixturePages}
						venues={venues}
						teachers={teachers}
						teams={teams}
						setTeams={setTeams}
						opponents={opponents}
						setOpponents={setOpponents}
						filteredVenues={filteredVenues}
						setFilteredVenues={setFilteredVenues}
						games={games}
						setGames={setGames}
					/>
				)}
				{step === 4 && <Step4 importState={importState} />}

				<div className="flex justify-between w-full max-w-xl">
					<button
						className="btn btn-primary w-32 !shrink"
						onClick={() => {
							setStep((step) => {
								const newStep = step - 1;
								if (!checkNextNeedDisable(newStep)) setDisableNext(false);
								return newStep;
							});
						}}
						disabled={step === 1 || disablePrevious}
					>
						Previous
					</button>
					<button
						className="btn btn-primary w-32 !shrink"
						onClick={() => {
							setStep((step) => {
								const newStep = step + 1;
								setDisableNext(checkNextNeedDisable(newStep));
								if (newStep === 4) {
									setDisablePrevious(true);
									setNextLoading(true);
								}
								return newStep;
							});
						}}
						disabled={disableNext}
					>
						{nextLoading ? (
							<span className="loading loading-spinner loading-md"></span>
						) : step === 4 ? (
							'Finish'
						) : step === 3 ? (
							'Import to Database'
						) : (
							'Next'
						)}
					</button>
				</div>
			</main>
			{alert &&
				(alert.type === 'success' ? (
					<SuccessAlert message={alert.message} setAlert={setAlert} />
				) : (
					<ErrorAlert message={alert.message} setAlert={setAlert} />
				))}
		</>
	);
}
