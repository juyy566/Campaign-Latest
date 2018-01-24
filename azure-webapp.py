from flask import Flask, render_template, request, jsonify
import pymssql

db = pymssql.connect(host='sqldbplatingnum.database.windows.net', port=1433, user="platingnum@sqldbplatingnum", passwd="D0wnl0ad!", db="cozydb")
# connection_string = "Driver={ODBC Driver 13 for SQL Server};Server=tcp:sqldbplatingnum.database.windows.net,1433;Database=cozydb;Uid=platingnum@sqldbplatingnum;Pwd={D0wnl0ad!};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"
app = Flask(__name__)



@app.route('/', methods=['GET', 'POST'])
def home():
	if request.method == 'POST':
		# print(request)
		data = request.form
		print(data)
		resp_dict = {}
		try:
			query_string = "INSERT INTO CampaingTracker ( CAMPAIGNNAME, CAMPAIGNDETAILS, CAMPAIGNSTARTDATE, CAMPAIGNENDDATE, CAMPAIGN_ID ) VALUES('{}','{}','{}','{}','{}')".format(data['campaign_name'],data['campaign_details'],data['campaign_start'],data['campaign_end'],data['campaign_uniqueId'])
			# print(query_string)
		except Exception as e:
			resp_dict = { 'error': 'Wrong params', 'statusCode': '400' }
			return jsonify(resp_dict)
		# Logic to store the data in the database
		try:
			db.cursor().execute(query_string)
			db.commit()
			resp_dict = { 'success': 'true', 'statusCode': '200', 'uniqueId': data['campaign_uniqueId']}			
			db.close()
			return jsonify(resp_dict)
		except Exception as e:
			resp_dict = { 'error': str(e), 'statusCode': '400' }


	elif request.method == 'GET':
		# return render_template('index.html')
		return app.send_static_file('index.html')


@app.route('/data', methods=['GET'])
def searchData():
	try:
		query_string = "SELECT * FROM CampaingTracker"
		db.cursor().execute(query_string)
		query_results = [dict(zip([column[0] for column in db.cursor().description], row)) for row in db.cursor().fetchall()]
		resp_dict = { 'success': 'true', 'statusCode': '200', 'data': query_results}			
		return jsonify(query_results)
	except Exception as e:
		resp_dict = { 'error': str(e), 'statusCode': '400' }
		return jsonify(resp_dict)

if __name__ == '__main__':
	app.run(debug=True)