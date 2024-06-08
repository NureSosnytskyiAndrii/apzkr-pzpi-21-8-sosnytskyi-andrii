package andrii.sosnytskyi.nure.safetyshield.adapters

import andrii.sosnytskyi.nure.safetyshield.R
import andrii.sosnytskyi.nure.safetyshield.model.SensorData
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import java.util.Collections.emptyList

class SensorDataAdapter : RecyclerView.Adapter<SensorDataAdapter.SensorDataViewHolder>() {

    private var sensorDataList: List<SensorData> = emptyList()

    inner class SensorDataViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val typeTextView: TextView = itemView.findViewById(R.id.typeTextView)
        private val valueTextView: TextView = itemView.findViewById(R.id.valueTextView)
        private val createdTextView: TextView = itemView.findViewById(R.id.createdTextView)

        fun bind(sensorData: SensorData) {
            typeTextView.text = sensorData.type
            valueTextView.text = sensorData.value
            createdTextView.text = sensorData.created
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SensorDataViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_sensor_data, parent, false)
        return SensorDataViewHolder(view)
    }

    override fun onBindViewHolder(holder: SensorDataViewHolder, position: Int) {
        holder.bind(sensorDataList[position])
    }

    override fun getItemCount() = sensorDataList.size

    fun setSensorData(sensorDataList: List<SensorData>) {
        this.sensorDataList = sensorDataList
        notifyDataSetChanged()
    }
}
