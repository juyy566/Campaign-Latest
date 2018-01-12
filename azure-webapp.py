from flask import Flask, render_template, request, jsonify
import pypyodbc as pyodbc

connection_string = "Driver={ODBC Driver 13 for SQL Server};Server=tcp:sqldbplatingnum.database.windows.net,1433;Database=cozydb;Uid=platingnum@sqldbplatingnum;Pwd={D0wnl0ad!};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;"
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
	if request.method == 'POST':
		print(request.form)
		data = request.form
		query_string = "INSERT TO CampaingTracker(CampaignName,CampaignDetails,CampaignStartDate,CampaignEndDate,Campaign_ID) VALUES({},{},{},{},{})".format(data['campaign_name'],data['campaign_details'],data['campaign_startDate'],data['campaign_endDate'],data['campaign_uniqueId'])
		# Logic to store the data in the database
		try:
			db.cursor().execute(query_string)
			resp_dict = { 'success': 'true' }			
		except Exception as e:
			resp_dict = { 'error': str(e) }

		return jsonify(resp_dict)

	elif request.method == 'GET':
		# return render_template('index.html')
		return app.send_static_file('index.html')


if __name__ == '__main__':
	app.run(debug=True)