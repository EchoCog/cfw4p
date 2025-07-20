#!/usr/bin/env python3

'''

gnucash_rest.py -- A Flask app which responds to REST requests
with JSON responses

Copyright (C) 2013 Tom Lofts <dev@loftx.co.uk>

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 2 of
the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, contact:

Free Software Foundation Voice: +1-617-542-5942
51 Franklin Street, Fifth Floor Fax: +1-617-542-2652
Boston, MA 02110-1301, USA gnu@gnu.org

@author Tom Lofts <dev@loftx.co.uk>

'''

import gnucash
import gnucash_simple
import json
import atexit
from flask import Flask, abort, request, Response
import sys
import getopt

from decimal import Decimal

from gnucash.gnucash_business import Vendor, Bill, Entry, GncNumeric, \
    Customer, Invoice, Split, Account, Transaction

import datetime

from gnucash import \
    QOF_QUERY_AND, \
    QOF_QUERY_OR, \
    QOF_QUERY_NAND, \
    QOF_QUERY_NOR, \
    QOF_QUERY_XOR

from gnucash import \
    QOF_STRING_MATCH_NORMAL, \
    QOF_STRING_MATCH_CASEINSENSITIVE

from gnucash import \
    QOF_COMPARE_LT, \
    QOF_COMPARE_LTE, \
    QOF_COMPARE_EQUAL, \
    QOF_COMPARE_GT, \
    QOF_COMPARE_GTE, \
    QOF_COMPARE_NEQ

from gnucash import \
    QOF_DATE_MATCH_NORMAL

from gnucash import \
    INVOICE_TYPE

from gnucash import \
    INVOICE_IS_PAID

from gnucash import SessionOpenMode

app = Flask(__name__)
app.debug = True

@app.route('/accounts', methods=['GET', 'POST'])
def api_accounts():

    if request.method == 'GET':

        accounts = getAccounts(session.book)

        return Response(json.dumps(accounts), mimetype='application/json')

    elif request.method == 'POST':

        try:
            account = addAccount(session.books)
        except Error as error:
            return Response(json.dumps({'errors': [{'type' : error.type,
                'message': error.message, 'data': error.data}]}), status=400,
                mimetype='application/json')
        else:
            return Response(json.dumps(account), status=201,
                mimetype='application/json')

    else:
        return Response(json.dumps({'error': 'Method not allowed'}), status=405,
            mimetype='application/json')