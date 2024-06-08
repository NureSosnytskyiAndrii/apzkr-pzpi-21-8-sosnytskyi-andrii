package andrii.sosnytskyi.nure.safetyshield.adapters

import andrii.sosnytskyi.nure.safetyshield.R
import andrii.sosnytskyi.nure.safetyshield.model.UserInfo
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class UserInfoAdapter : RecyclerView.Adapter<UserInfoAdapter.UserViewHolder>() {

    private var userInfo: UserInfo? = null

    inner class UserViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val nameTextView: TextView = itemView.findViewById(R.id.nameTextView)
        private val emailTextView: TextView = itemView.findViewById(R.id.emailTextView)
        private val genderTextView: TextView = itemView.findViewById(R.id.genderTextView)
        private val positionTextView: TextView = itemView.findViewById(R.id.positionTextView)
        private val organizationNameTextView: TextView = itemView.findViewById(R.id.organizationNameTextView)
        private val organizationNameActivityView: TextView = itemView.findViewById(R.id.organizationActivityTextView)

        fun bind(userInfo: UserInfo) {
            nameTextView.text = userInfo.name
            emailTextView.text = userInfo.email
            genderTextView.text = userInfo.employee.gender
            positionTextView.text = userInfo.employee.position
            organizationNameActivityView.text = userInfo.organization.organization_name
            organizationNameActivityView.text = userInfo.organization.organization_activity
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_user, parent, false)
        return UserViewHolder(view)
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        userInfo?.let { holder.bind(it) }
    }

    override fun getItemCount(): Int {
        return if (userInfo != null) 1 else 0
    }

    fun setUser(userInfo: UserInfo?) {
        this.userInfo = userInfo
        notifyDataSetChanged()
    }
}
